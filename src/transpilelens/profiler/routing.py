from qiskit import QuantumCircuit
from transpilelens.profiler.interaction_graph import compare_interaction_graphs

def is_routing_consistent(ref_qc: QuantumCircuit, cand_qc: QuantumCircuit) -> bool:
    """
    A heuristic to check if the transformation is consistent with routing.
    This simple initial implementation considers a transformation "routing-consistent" if:
    1. The candidate contains SWAP gates not present (or differently present) in the reference.
    2. Alternatively, the interaction graph has changed (added edges) which suggests
       qubits were routed to interact, but the overall non-routing gate distribution
       remains largely similar (this requires more advanced checks later).

    For now, we simply flag if SWAPs were inserted or if it's a known routing pass.
    """
    ref_ops = dict(ref_qc.count_ops())
    cand_ops = dict(cand_qc.count_ops())
    ref_swaps = ref_ops.get("swap", 0)
    cand_swaps = cand_ops.get("swap", 0)

    if cand_swaps > ref_swaps:
        # SWAPs were inserted -> routing transformation
        return True

    graph_diff = compare_interaction_graphs(ref_qc, cand_qc)
    if graph_diff["num_added"] > 0:
        # Added interaction edges suggest bridging/detour routing (e.g. E6)
        # ONLY IF it is not a pure optimization (operations strictly decreased)
        # and not a synthesis/basis change
        cand_total = sum(cand_ops.values())
        ref_total = sum(ref_ops.values())
        if cand_total < ref_total:
            # Operation reduction indicates optimization, not routing
            return False

        ref_non_swap = set(ref_ops.keys()) - {"swap"}
        cand_non_swap = set(cand_ops.keys()) - {"swap"}
        if ref_non_swap and cand_non_swap != ref_non_swap:
            # Basis vocabulary changed, indicating synthesis, not routing
            return False

        return True

    return False
