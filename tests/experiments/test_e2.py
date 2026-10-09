from transpilelens.corpus.builders import build_e2_reference, build_e2_candidate
from transpilelens.profiler.semantic import check_equivalence
from transpilelens.profiler.resources import profile_resources, calculate_resource_delta

def test_e2_synthesis_equivalence_feasibility():
    """
    Test the M3 feasibility experiment E2.
    Validates that:
    1. A reference and candidate circuit can be generated.
    2. They are semantically equivalent according to QCEC.
    3. They demonstrate a meaningful structural difference.
    """
    # 1. Build circuits
    ref = build_e2_reference()
    cand = build_e2_candidate(ref)
    
    # 2. Semantic check
    sem_result = check_equivalence(ref, cand)
    assert sem_result.status == "equivalent", f"Expected equivalence, got {sem_result.status} (reason: {sem_result.reason})"
    
    # 3. Structural profile
    ref_res = profile_resources(ref)
    cand_res = profile_resources(cand)
    
    delta = calculate_resource_delta(ref_res, cand_res)
    
    # 4. Assert structural difference exists
    # If optimization_level=3 was effective, the gate counts, depth, or 2-qubit ops will differ.
    diff_exists = (
        delta["total_ops"]["delta"] != 0 or
        delta["depth"]["delta"] != 0 or
        delta["two_qubit_ops"]["delta"] != 0
    )
    
    assert diff_exists, "E2 failed: No meaningful structural difference observed between reference and candidate."

def test_resource_profiler():
    from qiskit import QuantumCircuit
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    
    prof = profile_resources(qc)
    assert prof.total_ops == 2
    assert prof.depth == 2
    assert prof.width == 2
    assert prof.two_qubit_ops == 1
    assert prof.gate_counts.get("h", 0) == 1
    assert prof.gate_counts.get("cx", 0) == 1
