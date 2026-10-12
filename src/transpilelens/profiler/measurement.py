from qiskit import QuantumCircuit
from typing import Dict, List, Any

def extract_measurement_mapping(qc: QuantumCircuit) -> Dict[int, List[int]]:
    """
    Extracts a mapping of physical/virtual qubits to classical bits.
    Returns a dictionary mapping qubit indices to a list of classical bit indices they are measured into.
    """
    mapping = {}
    for instr in qc.data:
        if instr.operation.name == "measure":
            q_idx = qc.find_bit(instr.qubits[0]).index
            c_idx = qc.find_bit(instr.clbits[0]).index
            if q_idx not in mapping:
                mapping[q_idx] = []
            mapping[q_idx].append(c_idx)
    return mapping

def compare_measurements(ref_qc: QuantumCircuit, cand_qc: QuantumCircuit) -> Dict[str, Any]:
    ref_map = extract_measurement_mapping(ref_qc)
    cand_map = extract_measurement_mapping(cand_qc)
    
    # Are the same qubits measured?
    ref_measured_qubits = set(ref_map.keys())
    cand_measured_qubits = set(cand_map.keys())
    
    has_measurements = bool(ref_map or cand_map)
    # Are the classical destinations identical?
    # True if measurements exist and match; if unmeasured, identical_mapping is False (or distinguished by has_measurements)
    mapping_differences = bool(ref_map != cand_map)
    identical_mapping = (ref_map == cand_map) and has_measurements
    
    return {
        "has_measurements": has_measurements,
        "identical_mapping": identical_mapping,
        "ref_measured_qubits": list(ref_measured_qubits),
        "cand_measured_qubits": list(cand_measured_qubits),
        "mapping_differences_exist": mapping_differences
    }
