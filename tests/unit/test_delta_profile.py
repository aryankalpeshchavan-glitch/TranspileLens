import json
from transpilelens.profiler.delta_profile import (
    DeltaProfile, ProfileMetadata, ResourceDelta, GraphDelta,
    GateDistributionDelta, MeasurementDelta, RoutingEvidence,
    Interpretation
)
from transpilelens.profiler.semantic import SemanticResult
from transpilelens.profiler.resources import ResourceProfile
from transpilelens.profiler.interaction_graph import InteractionGraphProfile

def test_delta_profile_serialization():
    meta = ProfileMetadata(
        source_identifier="test",
        reference_identifier="ref",
        candidate_identifier="cand"
    )
    semantic = SemanticResult(status="equivalent", reason="none")
    resources = ResourceDelta(
        reference=ResourceProfile(total_ops=2, depth=2, two_qubit_ops=1, width=2, gate_counts={"cx": 1, "h": 1}),
        candidate=ResourceProfile(total_ops=2, depth=2, two_qubit_ops=1, width=2, gate_counts={"cx": 1, "h": 1}),
        deltas={"total_ops": {"delta": 0, "relative": 0.0}}
    )
    graph = GraphDelta(
        reference=InteractionGraphProfile(num_nodes=2, num_edges=1, density=1.0),
        candidate=InteractionGraphProfile(num_nodes=2, num_edges=1, density=1.0),
        added_edges=[],
        removed_edges=[]
    )
    dist = GateDistributionDelta(
        reference={"h": 0.5, "cx": 0.5},
        candidate={"h": 0.5, "cx": 0.5},
        js_divergence=0.0
    )
    measure = MeasurementDelta(identical_mapping=True, mapping_differences_exist=False)
    routing = RoutingEvidence(is_routing_consistent=False)
    
    profile = DeltaProfile(
        metadata=meta,
        semantic=semantic,
        resources=resources,
        interaction_graph=graph,
        gate_distribution=dist,
        measurement=measure,
        routing=routing
    )
    
    json_str = profile.to_json()
    data = json.loads(json_str)
    
    assert data["metadata"]["source_identifier"] == "test"
    assert data["semantic"]["status"] == "equivalent"
    assert data["gate_distribution"]["js_divergence"] == 0.0

def test_delta_profile_deserialization():
    json_data = {
        "metadata": {
            "source_identifier": "test2",
            "reference_identifier": "ref2",
            "candidate_identifier": "cand2",
            "schema_version": "1.0.0"
        },
        "semantic": {
            "status": "inconclusive",
            "reason": "timeout",
            "checker_version": "1.0.0"
        },
        "resources": {
            "reference": {"total_ops": 0, "depth": 0, "two_qubit_ops": 0, "width": 1, "gate_counts": {}},
            "candidate": {"total_ops": 0, "depth": 0, "two_qubit_ops": 0, "width": 1, "gate_counts": {}},
            "deltas": {}
        },
        "interaction_graph": {
            "reference": {"num_nodes": 1, "num_edges": 0, "density": 0.0},
            "candidate": {"num_nodes": 1, "num_edges": 0, "density": 0.0},
            "added_edges": [],
            "removed_edges": []
        },
        "gate_distribution": {
            "reference": {},
            "candidate": {},
            "js_divergence": 0.0
        },
        "measurement": {
            "identical_mapping": True,
            "mapping_differences_exist": False
        },
        "routing": {
            "is_routing_consistent": False
        },
        "interpretation": None
    }
    
    profile = DeltaProfile(**json_data)
    assert profile.metadata.source_identifier == "test2"
    assert profile.semantic.status == "inconclusive"
