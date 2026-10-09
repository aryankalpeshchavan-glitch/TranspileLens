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
