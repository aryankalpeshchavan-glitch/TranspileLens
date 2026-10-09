import numpy as np
from scipy.spatial.distance import jensenshannon
from typing import Dict, Any
from qiskit import QuantumCircuit

def calculate_gate_distribution(qc: QuantumCircuit) -> Dict[str, float]:
    ops = dict(qc.count_ops())
    total = sum(ops.values())
    if total == 0:
        return {}
    return {gate: count / total for gate, count in ops.items()}

def calculate_distribution_divergence(ref_qc: QuantumCircuit, cand_qc: QuantumCircuit) -> float:
    """
    Calculates Jensen-Shannon divergence between reference and candidate gate distributions.
    Returns 0.0 if both circuits are empty.
    """
    ref_dist = calculate_gate_distribution(ref_qc)
    cand_dist = calculate_gate_distribution(cand_qc)
    
    if not ref_dist and not cand_dist:
        return 0.0
        
    vocab = set(ref_dist.keys()).union(set(cand_dist.keys()))
    
    p = np.array([ref_dist.get(g, 0.0) for g in vocab])
    q = np.array([cand_dist.get(g, 0.0) for g in vocab])
    
    # jensenshannon returns the distance. JS divergence is the square of the distance.
    distance = jensenshannon(p, q)
    return float(distance ** 2)
