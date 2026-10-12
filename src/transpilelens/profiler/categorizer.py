from transpilelens.profiler.delta_profile import DeltaProfile, Interpretation

def categorize(profile: DeltaProfile) -> Interpretation:
    """
    Applies deterministic rules to classify the transformation into one of the 8 categories.
    """
    sem = profile.semantic
    res = profile.resources
    routing = profile.routing
    meas = profile.measurement
    
    # Check for measurable differences
    diff_exists = False
    for k, v in res.deltas.items():
        if v.get("delta") != 0:
            diff_exists = True
            break
            
    ref_vocab = set(res.reference.gate_counts.keys())
    cand_vocab = set(res.candidate.gate_counts.keys())
    if ref_vocab != cand_vocab:
        diff_exists = True
        
    if profile.gate_distribution.js_divergence > 0.0 or profile.interaction_graph.added_edges or profile.interaction_graph.removed_edges:
        diff_exists = True

    # Rule 1 - Logical computation change
    if sem.status == "not_equivalent":
        return Interpretation(
            category_id="1",
            category_name="Logical computation change",
            evidence="Semantic verifier explicitly reported inequivalence."
        )
        
    # If it's not strictly "equivalent", we can't safely classify anything dependent on equivalence.
    if sem.status != "equivalent":
        return Interpretation(
            category_id="8",
            category_name="Unclassified or no measurable delta",
            evidence="Semantic check was inconclusive; cannot confidently classify.",
            warnings=["Inconclusive semantic status prevents further definitive classification."]
        )

    # Rule 2 - Measurement-semantic change
    if meas.mapping_differences_exist:
        return Interpretation(
            category_id="2",
            category_name="Measurement-semantic change",
            evidence="Measurable differences in physical-to-classical mapping detected."
        )
        
    if not diff_exists:
        return Interpretation(
            category_id="8",
            category_name="Unclassified or no measurable delta",
            evidence="No measurable structural or resource differences detected."
        )

    ref_vocab = set(res.reference.gate_counts.keys())
    cand_vocab = set(res.candidate.gate_counts.keys())
    non_routing_ref = ref_vocab - {"swap"}
    non_routing_cand = cand_vocab - {"swap"}
    ops_delta = res.deltas.get("total_ops", {}).get("delta", 0)

    # Rule 5 - Equivalent synthesis
    # If the non-routing gate vocabulary changed, it's basis synthesis/translation
    if non_routing_ref != non_routing_cand:
        return Interpretation(
            category_id="5",
            category_name="Equivalent synthesis",
            evidence="Gate vocabulary changed, suggesting synthesis or basis translation."
        )

    # Rule 4 - Equivalent optimization
    # If ops strictly decreased, it is optimization (never routing)
    if ops_delta < 0:
        return Interpretation(
            category_id="4",
            category_name="Equivalent optimization",
            evidence="Total operations decreased significantly, suggesting optimization."
        )

    # Rule 3 - Equivalent routing/layout
    if routing.is_routing_consistent:
        return Interpretation(
            category_id="3",
            category_name="Equivalent routing/layout",
            evidence="Routing heuristics (like SWAP insertion or graph densification) observed."
        )
        
    # Rule 6 - Resource-only change
    if ops_delta > 0:
        return Interpretation(
            category_id="6",
            category_name="Resource-only change",
            evidence="Resource metrics changed but without structural routing or synthesis signatures."
        )

    # Fallback to category 7
    return Interpretation(
        category_id="7",
        category_name="Semantically equivalent, structurally unexplained transformation",
        evidence="Measurable structural differences exist but are not explained by current routing, synthesis, or optimization heuristics."
    )
