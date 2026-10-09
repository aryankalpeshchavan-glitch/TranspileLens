from typing import Dict, Any, Optional
from pydantic import BaseModel
from qiskit import QuantumCircuit

class ResourceProfile(BaseModel):
    total_ops: int
    depth: int
    two_qubit_ops: int
    width: int
    gate_counts: Dict[str, int]

def profile_resources(qc: QuantumCircuit) -> ResourceProfile:
    if not isinstance(qc, QuantumCircuit):
        raise ValueError("Input must be a QuantumCircuit")
        
    ops_dict = dict(qc.count_ops())
    total_ops = sum(ops_dict.values())
    depth = qc.depth()
    width = qc.num_qubits
    
    two_qubit_ops = 0
    for instr in qc.data:
        if len(instr.qubits) == 2:
            two_qubit_ops += 1
            
    return ResourceProfile(
        total_ops=total_ops,
        depth=depth,
        two_qubit_ops=two_qubit_ops,
        width=width,
        gate_counts=ops_dict
    )

def calculate_resource_delta(ref: ResourceProfile, cand: ResourceProfile) -> Dict[str, Any]:
    def delta_and_relative(r: int, c: int) -> Dict[str, Optional[float]]:
        d = c - r
        rel = (d / r) if r != 0 else None
        return {"delta": d, "relative": rel}
        
    return {
        "total_ops": delta_and_relative(ref.total_ops, cand.total_ops),
        "depth": delta_and_relative(ref.depth, cand.depth),
        "two_qubit_ops": delta_and_relative(ref.two_qubit_ops, cand.two_qubit_ops)
    }
