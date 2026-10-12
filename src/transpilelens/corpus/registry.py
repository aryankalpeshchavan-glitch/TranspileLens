from typing import List, Dict, Any, Callable
from pydantic import BaseModel
from qiskit import QuantumCircuit

from transpilelens.corpus.builders import (
    build_e1_reference, build_e1_candidate,
    build_e2_reference, build_e2_candidate,
    build_e3_reference, build_e3_candidate,
    build_e4_reference, build_e4_candidate,
    build_e5_reference, build_e5_candidate,
    build_e6_reference, build_e6_candidate
)
from transpilelens.profiler.semantic import check_equivalence
from transpilelens.profiler.resources import profile_resources, calculate_resource_delta
from transpilelens.profiler.interaction_graph import profile_interaction_graph, compare_interaction_graphs
from transpilelens.profiler.gate_distribution import calculate_distribution_divergence
from transpilelens.profiler.measurement import compare_measurements
from transpilelens.profiler.routing import is_routing_consistent
from transpilelens.profiler.delta_profile import (
    DeltaProfile, ProfileMetadata, ResourceDelta, GraphDelta,
    GateDistributionDelta, MeasurementDelta, RoutingEvidence
)
from transpilelens.profiler.categorizer import categorize

class ExperimentDef(BaseModel):
    case_id: str
    name: str
    purpose: str
    expected_status: str

EXPERIMENTS = [
    ExperimentDef(case_id="E1", name="Basis-preserving rewrite", purpose="Test basic structure diffs on H vs Ry/Z.", expected_status="equivalent"),
    ExperimentDef(case_id="E2", name="Synthesis-equivalent rewrite", purpose="Test deep resynthesis changes.", expected_status="equivalent"),
    ExperimentDef(case_id="E3", name="Routing-equivalent rewrite", purpose="Test SWAP routing insertion.", expected_status="equivalent"),
    ExperimentDef(case_id="E4", name="Resource-only identity insertion", purpose="Test redundant identity ops.", expected_status="equivalent"),
    ExperimentDef(case_id="E5", name="Measurement-interface case", purpose="Test diffs in measurement interfaces.", expected_status="not_equivalent"),
    ExperimentDef(case_id="E6", name="Routing disguise / detour", purpose="Test non-SWAP routing / detour algorithms.", expected_status="equivalent"),
]

def get_builders(case_id: str):
    mapping = {
        "E1": (build_e1_reference, build_e1_candidate),
        "E2": (build_e2_reference, build_e2_candidate),
        "E3": (build_e3_reference, build_e3_candidate),
        "E4": (build_e4_reference, build_e4_candidate),
        "E5": (build_e5_reference, build_e5_candidate),
        "E6": (build_e6_reference, build_e6_candidate),
    }
    return mapping[case_id]

def run_experiment(exp: ExperimentDef) -> Dict[str, Any]:
    ref_fn, cand_fn = get_builders(exp.case_id)
    ref_qc = ref_fn()
    cand_qc = cand_fn(ref_qc)

    import qiskit
    import mqt.qcec as qcec
    import sys
    from datetime import datetime
    meta = ProfileMetadata(
        source_identifier=exp.case_id,
        reference_identifier=f"{exp.case_id}_ref",
        candidate_identifier=f"{exp.case_id}_cand",
        qiskit_version=qiskit.__version__,
        qcec_version=qcec.__version__,
        python_version=sys.version.split(" ")[0],
        run_timestamp=datetime.now().isoformat()
    )

    sem = check_equivalence(ref_qc, cand_qc)

    r_ref = profile_resources(ref_qc)
    r_cand = profile_resources(cand_qc)
    res_delta = ResourceDelta(reference=r_ref, candidate=r_cand, deltas=calculate_resource_delta(r_ref, r_cand))

    g_ref = profile_interaction_graph(ref_qc)
    g_cand = profile_interaction_graph(cand_qc)
    g_diff = compare_interaction_graphs(ref_qc, cand_qc)
    graph_delta = GraphDelta(
        reference=g_ref, candidate=g_cand,
        added_edges=g_diff["added_edges"], removed_edges=g_diff["removed_edges"]
    )

    dist_div = calculate_distribution_divergence(ref_qc, cand_qc)
    dist_delta = GateDistributionDelta(reference={}, candidate={}, js_divergence=dist_div)

    m_diff = compare_measurements(ref_qc, cand_qc)
    meas_delta = MeasurementDelta(
        identical_mapping=m_diff["identical_mapping"],
        mapping_differences_exist=m_diff["mapping_differences_exist"]
    )

    rout_consist = is_routing_consistent(ref_qc, cand_qc)
    rout_delta = RoutingEvidence(is_routing_consistent=rout_consist)

    # Interface validation checks
    from transpilelens.profiler.delta_profile import InterfaceCheck, InterfaceValidation
    checks = []

    # Check 1: Measurement Mapping
    if not m_diff.get("has_measurements", False):
        checks.append(InterfaceCheck(
            check_name="Measurement Mapping", status="missing",
            evidence={"ref_qubits": [], "cand_qubits": []},
            explanation="No measurement operations present in either circuit; mapping evidence unavailable."
        ))
    elif m_diff["identical_mapping"]:
        checks.append(InterfaceCheck(
            check_name="Measurement Mapping", status="pass",
            evidence={"ref_qubits": m_diff["ref_measured_qubits"], "cand_qubits": m_diff["cand_measured_qubits"]},
            explanation="Measurement physical-to-classical mapping is identical."
        ))
    else:
        checks.append(InterfaceCheck(
            check_name="Measurement Mapping", status="fail",
            evidence={"ref_qubits": m_diff["ref_measured_qubits"], "cand_qubits": m_diff["cand_measured_qubits"]},
            explanation="Measurement mapping differs between reference and candidate."
        ))

    # Check 2: Qubit and Classical bit counts
    ref_q, cand_q = ref_qc.num_qubits, cand_qc.num_qubits
    ref_c, cand_c = ref_qc.num_clbits, cand_qc.num_clbits
    if ref_q == cand_q and ref_c == cand_c:
        checks.append(InterfaceCheck(
            check_name="Register Widths", status="pass",
            evidence={"ref_qubits": ref_q, "cand_qubits": cand_q, "ref_clbits": ref_c, "cand_clbits": cand_c},
            explanation="Number of qubits and classical bits match."
        ))
    else:
        detail = []
        if ref_q != cand_q:
            detail.append(f"qubits ({ref_q} ref vs {cand_q} cand)")
        if ref_c != cand_c:
            detail.append(f"classical bits ({ref_c} ref vs {cand_c} cand)")
        explanation = f"Register widths differ: {', '.join(detail)}."
        if cand_q > ref_q:
            explanation += f" Candidate introduced {cand_q - ref_q} auxiliary/ancilla qubit(s) (e.g. for detour routing)."
        checks.append(InterfaceCheck(
            check_name="Register Widths", status="fail",
            evidence={"ref_qubits": ref_q, "cand_qubits": cand_q, "ref_clbits": ref_c, "cand_clbits": cand_c},
            explanation=explanation
        ))

    interface_val = InterfaceValidation(checks=checks)

    profile = DeltaProfile(
        metadata=meta, semantic=sem, resources=res_delta,
        interaction_graph=graph_delta, gate_distribution=dist_delta,
        measurement=meas_delta, routing=rout_delta,
        interface_validation=interface_val
    )

    interp = categorize(profile)
    profile.interpretation = interp

    # Check acceptance
    actual_status = sem.status
    if actual_status == exp.expected_status:
        accept = "PASS"
    elif exp.expected_status == "equivalent" and actual_status == "inconclusive":
        accept = "INCONCLUSIVE"
    else:
        accept = "FAIL"

    return {
        "case_id": exp.case_id,
        "acceptance": accept,
        "profile": profile,
        "expected_status": exp.expected_status,
        "actual_status": actual_status,
        "category": interp.category_id
    }
