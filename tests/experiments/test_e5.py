from transpilelens.corpus.builders import build_e5_reference, build_e5_candidate
from transpilelens.profiler.semantic import check_equivalence
from transpilelens.profiler.measurement import compare_measurements

def test_e5_equivalence_contract():
    ref = build_e5_reference()
    cand = build_e5_candidate(ref)
    sem_result = check_equivalence(ref, cand)
    assert sem_result.status == "not_equivalent", "E5 must be strictly not_equivalent due to garbage qubits without partial equivalence."

def test_e5_measurement_mapping():
    ref = build_e5_reference()
    cand = build_e5_candidate(ref)
    meas_diff = compare_measurements(ref, cand)
    assert meas_diff["mapping_differences_exist"] == True
    assert meas_diff["identical_mapping"] == False
