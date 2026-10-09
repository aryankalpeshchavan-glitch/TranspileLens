from qiskit import QuantumCircuit
from transpilelens.profiler.resources import profile_resources, calculate_resource_delta

def test_empty_circuit():
    qc = QuantumCircuit(2)
    prof = profile_resources(qc)
    assert prof.total_ops == 0
    assert prof.depth == 0
    assert prof.two_qubit_ops == 0
    
    delta = calculate_resource_delta(prof, prof)
    assert delta["total_ops"]["relative"] is None
    assert delta["total_ops"]["delta"] == 0

def test_normal_circuit():
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    
    prof = profile_resources(qc)
    assert prof.total_ops == 2
    assert prof.two_qubit_ops == 1
    assert prof.depth == 2
    
    qc2 = QuantumCircuit(2)
    qc2.h(0)
    
    prof2 = profile_resources(qc2)
    
    delta = calculate_resource_delta(prof, prof2)
    assert delta["total_ops"]["delta"] == -1
    assert delta["total_ops"]["relative"] == -0.5
