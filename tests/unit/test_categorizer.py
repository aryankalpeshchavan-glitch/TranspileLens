from transpilelens.profiler.delta_profile import (
    DeltaProfile, ProfileMetadata, ResourceDelta, GraphDelta,
    GateDistributionDelta, MeasurementDelta, RoutingEvidence
)
from transpilelens.profiler.semantic import SemanticResult
from transpilelens.profiler.resources import ResourceProfile
from transpilelens.profiler.interaction_graph import InteractionGraphProfile
from transpilelens.profiler.categorizer import categorize

def make_dummy_profile(status="equivalent", mapping_diff=False, ops_delta=0, routing_consist=False, ref_vocab=["h"], cand_vocab=["h"]):
    return DeltaProfile(
        metadata=ProfileMetadata(source_identifier="s", reference_identifier="r", candidate_identifier="c"),
        semantic=SemanticResult(status=status, reason="none"),
        resources=ResourceDelta(
            reference=ResourceProfile(total_ops=2, depth=2, two_qubit_ops=1, width=2, gate_counts={g: 1 for g in ref_vocab}),
            candidate=ResourceProfile(total_ops=2+ops_delta, depth=2, two_qubit_ops=1, width=2, gate_counts={g: 1 for g in cand_vocab}),
            deltas={"total_ops": {"delta": ops_delta}}
        ),
        interaction_graph=GraphDelta(
            reference=InteractionGraphProfile(num_nodes=2, num_edges=1, density=1.0),
            candidate=InteractionGraphProfile(num_nodes=2, num_edges=1, density=1.0),
            added_edges=[], removed_edges=[]
        ),
        gate_distribution=GateDistributionDelta(reference={}, candidate={}, js_divergence=0.0),
        measurement=MeasurementDelta(identical_mapping=not mapping_diff, mapping_differences_exist=mapping_diff),
        routing=RoutingEvidence(is_routing_consistent=routing_consist)
    )

def test_categorizer_logical_change():
    prof = make_dummy_profile(status="not_equivalent")
    interp = categorize(prof)
    assert interp.category_id == "1"

def test_categorizer_inconclusive():
    prof = make_dummy_profile(status="inconclusive", ops_delta=-1)
    interp = categorize(prof)
    assert interp.category_id == "8"

def test_categorizer_routing():
    prof = make_dummy_profile(ops_delta=2, routing_consist=True)
    interp = categorize(prof)
    assert interp.category_id == "3"

def test_categorizer_optimization():
    prof = make_dummy_profile(ops_delta=-1)
    interp = categorize(prof)
    assert interp.category_id == "4"

def test_categorizer_synthesis():
    prof = make_dummy_profile(ops_delta=0, ref_vocab=["h"], cand_vocab=["cx"])
    interp = categorize(prof)
    assert interp.category_id == "5"

def test_categorizer_unexplained():
    prof = make_dummy_profile(ops_delta=1)
    interp = categorize(prof)
    assert interp.category_id == "6" # ops increased, no routing. Handled as resource-only

def test_categorizer_no_delta():
    prof = make_dummy_profile(ops_delta=0)
    interp = categorize(prof)
    assert interp.category_id == "8"
