from transpilelens.corpus.builders import build_e1_reference, build_e1_candidate
from qiskit.quantum_info import Operator
import numpy as np

def test_e1_operator_equivalence():
    ref = build_e1_reference()
    cand = build_e1_candidate(ref)
    
    op_ref = Operator(ref)
    op_cand = Operator(cand)
    
    assert op_ref.equiv(op_cand), "Operators are not equivalent up to global phase"

def test_e1_qcec_equivalence():
    try:
        from mqt import qcec
    except ImportError:
        import pytest
        pytest.skip("mqt.qcec not installed")
        
    ref = build_e1_reference()
    cand = build_e1_candidate(ref)
    
    result = qcec.verify(ref, cand)
    assert "equivalent" in str(result.equivalence) and "not" not in str(result.equivalence), "QCEC found circuits inequivalent"
