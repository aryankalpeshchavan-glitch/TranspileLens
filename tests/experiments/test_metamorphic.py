from qiskit import QuantumCircuit
from qiskit.quantum_info import Operator
from transpilelens.profiler.semantic import check_equivalence
from transpilelens.corpus.builders import (
    build_e1_reference, build_e1_candidate,
    build_e2_reference, build_e2_candidate,
    build_e3_reference, build_e3_candidate,
    build_e4_reference, build_e4_candidate,
    build_e5_reference, build_e5_candidate,
    build_e6_reference, build_e6_candidate
)
from transpilelens.corpus.registry import run_experiment, EXPERIMENTS
from transpilelens.profiler.measurement import compare_measurements

def test_metamorphic_equivalent_rewrite_e1():
    """Metamorphic Test 1: Equivalent basis rewrite (H -> Ry(pi/2) Z)."""
    ref = build_e1_reference()
    cand = build_e1_candidate(ref)
    
    # 1. Semantic equivalence via QCEC
    sem = check_equivalence(ref, cand)
    assert sem.status == "equivalent"
    
    # 2. Independent operator verification
    assert Operator(ref).equiv(Operator(cand))
    
    # 3. Categorizer classification: basis translation / synthesis
    e1_def = next(e for e in EXPERIMENTS if e.case_id == "E1")
    res = run_experiment(e1_def)
    assert res["actual_status"] == "equivalent"
    assert res["category"] == "5"

def test_metamorphic_identity_insertion():
    """Metamorphic Test 2: Identity insertion (X*3) produces equivalent result with resource growth."""
    ref = build_e4_reference()
    cand = build_e4_candidate(ref)
    
    sem = check_equivalence(ref, cand)
    assert sem.status == "equivalent"
    
    e4_def = next(e for e in EXPERIMENTS if e.case_id == "E4")
    res = run_experiment(e4_def)
    assert res["actual_status"] == "equivalent"
    assert res["profile"].resources.deltas["total_ops"]["delta"] == 2
    assert res["category"] == "6"  # Resource-only change

def test_metamorphic_inequivalent_control():
    """Metamorphic Test 3: Known inequivalent control (X vs H) is caught."""
    ref = QuantumCircuit(1)
    ref.x(0)
    cand = QuantumCircuit(1)
    cand.h(0)
    
    sem = check_equivalence(ref, cand)
    assert sem.status == "not_equivalent"
    assert not Operator(ref).equiv(Operator(cand))

def test_metamorphic_resource_only():
    """Metamorphic Test 4: Resource-only changes without routing or synthesis."""
    ref = QuantumCircuit(1)
    ref.h(0)
    cand = QuantumCircuit(1)
    cand.h(0)
    cand.x(0)
    cand.x(0)
    
    sem = check_equivalence(ref, cand)
    assert sem.status == "equivalent"

def test_metamorphic_routing_supported_e3_e6():
    """Metamorphic Test 5: Supported routing transformations (E3 SWAP, E6 detour)."""
    ref3 = build_e3_reference()
    cand3 = build_e3_candidate(ref3)
    assert check_equivalence(ref3, cand3).status == "equivalent"
    
    e3_def = next(e for e in EXPERIMENTS if e.case_id == "E3")
    res3 = run_experiment(e3_def)
    assert res3["actual_status"] == "equivalent"
    assert res3["category"] == "3"
    
    ref6 = build_e6_reference()
    cand6 = build_e6_candidate(ref6)
    assert check_equivalence(ref6, cand6).status == "equivalent"
    
    e6_def = next(e for e in EXPERIMENTS if e.case_id == "E6")
    res6 = run_experiment(e6_def)
    assert res6["actual_status"] == "equivalent"
    assert res6["category"] == "3"

def test_metamorphic_interface_integrity():
    """Metamorphic Test 6: Interface integrity and measurement mapping validation."""
    # Case A: E5 has measurements that mismatch
    ref5 = build_e5_reference()
    cand5 = build_e5_candidate(ref5)
    m_diff5 = compare_measurements(ref5, cand5)
    assert m_diff5["has_measurements"] is True
    assert m_diff5["mapping_differences_exist"] is True
    assert m_diff5["identical_mapping"] is False
    
    e5_def = next(e for e in EXPERIMENTS if e.case_id == "E5")
    res5 = run_experiment(e5_def)
    meas_check5 = next(c for c in res5["profile"].interface_validation.checks if c.check_name == "Measurement Mapping")
    assert meas_check5.status == "fail"
    
    # Case B: E1 has no measurements -> status is explicitly missing
    e1_def = next(e for e in EXPERIMENTS if e.case_id == "E1")
    res1 = run_experiment(e1_def)
    meas_check1 = next(c for c in res1["profile"].interface_validation.checks if c.check_name == "Measurement Mapping")
    assert meas_check1.status == "missing"
    assert "No measurement operations present" in meas_check1.explanation
    
    # Case C: Circuits with identical measurements -> status is pass
    qc_m1 = QuantumCircuit(1, 1)
    qc_m1.measure(0, 0)
    qc_m2 = QuantumCircuit(1, 1)
    qc_m2.measure(0, 0)
    m_diff_pass = compare_measurements(qc_m1, qc_m2)
    assert m_diff_pass["has_measurements"] is True
    assert m_diff_pass["identical_mapping"] is True
    assert m_diff_pass["mapping_differences_exist"] is False

