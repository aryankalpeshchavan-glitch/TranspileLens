from qiskit import QuantumCircuit
from transpilelens.profiler.interaction_graph import profile_interaction_graph, compare_interaction_graphs
from transpilelens.profiler.gate_distribution import calculate_gate_distribution, calculate_distribution_divergence
from transpilelens.profiler.measurement import compare_measurements
from transpilelens.profiler.routing import is_routing_consistent

def test_interaction_graph():
    qc = QuantumCircuit(3)
    qc.cx(0, 1)
    qc.cx(1, 2)
    
    prof = profile_interaction_graph(qc)
    assert prof.num_nodes == 3
    assert prof.num_edges == 2
    
    qc2 = QuantumCircuit(3)
    qc2.cx(0, 2)
    
    diff = compare_interaction_graphs(qc, qc2)
    assert diff["num_added"] == 1  # (0, 2)
    assert diff["num_removed"] == 2 # (0, 1) and (1, 2)

def test_gate_distribution():
    qc1 = QuantumCircuit(1)
    qc1.h(0)
    
    qc2 = QuantumCircuit(1)
    qc2.x(0)
    
    dist = calculate_gate_distribution(qc1)
    assert dist["h"] == 1.0
    
    div = calculate_distribution_divergence(qc1, qc2)
    assert div > 0.0

def test_measurement_mapping():
    qc1 = QuantumCircuit(2, 2)
    qc1.measure(0, 0)
    
    qc2 = QuantumCircuit(2, 2)
    qc2.measure(1, 1)
    
    diff = compare_measurements(qc1, qc2)
    assert diff["identical_mapping"] is False
    assert diff["mapping_differences_exist"] is True

def test_routing_consistency():
    qc1 = QuantumCircuit(2)
    qc1.cx(0, 1)
    
    qc2 = QuantumCircuit(2)
    qc2.swap(0, 1)
    
    assert is_routing_consistent(qc1, qc2) is True
