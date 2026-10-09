from qiskit import QuantumCircuit
from transpilelens.profiler.semantic import check_equivalence, SemanticResult

def test_identical_circuit():
    qc = QuantumCircuit(2)
    qc.h(0)
    qc.cx(0, 1)
    
    result = check_equivalence(qc, qc)
    assert result.status == "equivalent"
    assert result.reason == "none"

def test_equivalent_circuits():
    qc1 = QuantumCircuit(1)
    qc1.h(0)
    
    qc2 = QuantumCircuit(1)
    # H = Y^(1/2) * Z or something similar, let's just do x, y, z equivalences.
    # Actually, ry(pi/2) and rx(pi) etc.
    # Let's keep it simple: H H = I
    qc1_2 = QuantumCircuit(1)
    qc1_2.h(0)
    qc1_2.h(0)
    qc1_2.h(0)
    
    result = check_equivalence(qc1, qc1_2)
    assert result.status == "equivalent"

def test_inequivalent_circuits():
    qc1 = QuantumCircuit(1)
    qc1.h(0)
    
    qc2 = QuantumCircuit(1)
    qc2.x(0)
    
    result = check_equivalence(qc1, qc2)
    assert result.status == "not_equivalent"

def test_error_handling():
    # Intentionally cause an error, e.g. passing None
    result = check_equivalence(None, None)
    assert result.status == "inconclusive"
    assert result.reason == "error"
    assert result.error_details is not None
