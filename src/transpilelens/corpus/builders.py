from qiskit import QuantumCircuit, transpile

def build_e2_reference() -> QuantumCircuit:
    """
    Constructs the reference circuit for the E2 experiment (Synthesis-equivalent rewrite).
    This circuit represents a simple 3-qubit operation (e.g. Toffoli) decomposed naively.
    """
    qc = QuantumCircuit(3)
    # Intentionally naive decomposition with redundant gates
    qc.h(0)
    qc.h(0) # redundancy
    qc.cx(0, 1)
    qc.cx(1, 2)
    qc.cx(1, 2) # redundancy
    qc.cz(0, 2)
    qc.z(0)
    qc.z(0) # redundancy
    return qc

def build_e2_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    """
    Constructs the candidate circuit for the E2 experiment by transpiling the reference.
    Optimization level 3 and a limited basis set forces re-synthesis that changes structure
    while maintaining semantic equivalence.
    """
    # Transpile with heavy optimization to change the structure
    # Using basis gates like ['cx', 'u3'] or ['cz', 'rx', 'ry', 'rz'] might produce different depth
    candidate = transpile(reference, optimization_level=3, basis_gates=['cz', 'u'])
    return candidate

def build_e1_reference() -> QuantumCircuit:
    qc = QuantumCircuit(1)
    qc.h(0)
    return qc
    
def build_e1_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    import numpy as np
    qc = QuantumCircuit(1)
    # y^(1/2) * z
    qc.z(0)
    qc.ry(np.pi / 2, 0)
    return qc

def build_e3_reference() -> QuantumCircuit:
    qc = QuantumCircuit(3)
    qc.cx(0, 2)
    return qc

def build_e3_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    qc = QuantumCircuit(3)
    # Routing 0 to 2 via 1 using a swap
    qc.swap(0, 1)
    qc.cx(1, 2)
    qc.swap(0, 1)
    return qc

def build_e4_reference() -> QuantumCircuit:
    qc = QuantumCircuit(1)
    qc.x(0)
    return qc

def build_e4_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    qc = QuantumCircuit(1)
    qc.x(0)
    qc.x(0)
    qc.x(0) # identity insertion x*x = I
    return qc

def build_e5_reference() -> QuantumCircuit:
    qc = QuantumCircuit(1, 1)
    qc.h(0)
    qc.measure(0, 0)
    return qc

def build_e5_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    qc = QuantumCircuit(2, 2)
    qc.h(1)
    qc.measure(1, 1) # mapped to different physical and classical bits
    return qc

def build_e6_reference() -> QuantumCircuit:
    qc = QuantumCircuit(2)
    qc.cx(0, 1)
    return qc

def build_e6_candidate(reference: QuantumCircuit) -> QuantumCircuit:
    qc = QuantumCircuit(3)
    # E6a: detour routing that is not straightforward SWAPs
    qc.cx(0, 2)
    qc.cx(2, 1)
    qc.cx(0, 2)
    return qc
