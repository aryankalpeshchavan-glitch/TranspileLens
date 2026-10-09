import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
import mqt.qcec as qcec
from qiskit import QuantumCircuit

class SemanticResult(BaseModel):
    status: str = Field(description="equivalent, not_equivalent, inconclusive")
    reason: str = Field(description="none, timeout, unsupported, error")
    checker_version: str = Field(default=qcec.__version__)
    runtime_sec: Optional[float] = None
    error_details: Optional[str] = None

def check_equivalence(reference: QuantumCircuit, candidate: QuantumCircuit, timeout_sec: float = 60.0) -> SemanticResult:
    """
    Checks semantic equivalence between a reference and a candidate circuit using MQT QCEC.
    """
    start_time = time.time()
    try:
        # qcec.verify returns an EquivalenceCheckingManager.Results object
        # Alternatively, we can use the simpler verify method
        result = qcec.verify(reference, candidate, timeout=timeout_sec)
        runtime = time.time() - start_time
        
        # Determine status
        status = "inconclusive"
        reason = "none"
        eq_str = str(result.equivalence)
        
        if "equivalent" in eq_str and "not" not in eq_str:
            status = "equivalent"
        elif "not_equivalent" in eq_str:
            status = "not_equivalent"
        elif "no_information" in eq_str:
            # Often due to timeout or unsupported configurations if no exception was raised
            reason = "timeout" # Or we can just leave it as none/unsupported based on runtime
            if runtime >= timeout_sec:
                reason = "timeout"
            else:
                reason = "unsupported"

        return SemanticResult(
            status=status,
            reason=reason,
            runtime_sec=runtime
        )
    except Exception as e:
        runtime = time.time() - start_time
        return SemanticResult(
            status="inconclusive",
            reason="error",
            runtime_sec=runtime,
            error_details=str(e)
        )
