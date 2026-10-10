from qiskit import QuantumCircuit, transpile
from typing import List, Callable, Tuple
from pydantic import BaseModel

class LegitimateCase(BaseModel):
    case_id: str
    name: str
    description: str
    optimization_level: int
    expected_status: str

def build_qft_3() -> QuantumCircuit:
    qc = QuantumCircuit(3)
    qc.h(2)
    qc.cp(3.14/2, 1, 2)
    qc.cp(3.14/4, 0, 2)
    qc.h(1)
    qc.cp(3.14/2, 0, 1)
    qc.h(0)
    qc.swap(0, 2)
    return qc

def build_ghz_4() -> QuantumCircuit:
    qc = QuantumCircuit(4)
    qc.h(0)
    for i in range(3):
        qc.cx(i, i+1)
    return qc

LEGITIMATE_CASES = [
    LegitimateCase(case_id="L1", name="QFT-3 O1", description="QFT 3-qubit transpiled at O1", optimization_level=1, expected_status="equivalent"),
    LegitimateCase(case_id="L2", name="QFT-3 O3", description="QFT 3-qubit transpiled at O3", optimization_level=3, expected_status="equivalent"),
    LegitimateCase(case_id="L3", name="GHZ-4 O3", description="GHZ 4-qubit transpiled at O3", optimization_level=3, expected_status="equivalent")
]

def get_legitimate_builders(case_id: str) -> Tuple[Callable[[], QuantumCircuit], Callable[[QuantumCircuit], QuantumCircuit]]:
    base_circuits = {
        "L1": build_qft_3,
        "L2": build_qft_3,
        "L3": build_ghz_4
    }
    
    case_def = next(c for c in LEGITIMATE_CASES if c.case_id == case_id)
    
    def ref_builder():
        return base_circuits[case_id]()
        
    def cand_builder(ref: QuantumCircuit):
        return transpile(ref, optimization_level=case_def.optimization_level)
        
    return ref_builder, cand_builder
