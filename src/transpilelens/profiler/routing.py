from qiskit import QuantumCircuit
from transpilelens.profiler.interaction_graph import compare_interaction_graphs

def is_routing_consistent(ref_qc: QuantumCircuit, cand_qc: QuantumCircuit) -> bool:
    """
    A heuristic to check if the transformation is consistent with routing.
    This simple initial implementation considers a transformation "routing-consistent" if:
    1. The candidate contains SWAP gates not present (or differently present) in the reference.
    2. Alternatively, the interaction graph has changed (added edges) which suggests 
       qubits were routed to interact, but the overall non-routing gate distribution 
       remains largely similar (this requires more advanced checks later).
       
    For now, we simply flag if SWAPs were inserted or if it's a known routing pass.
    """
    ref_swaps = dict(ref_qc.count_ops()).get("swap", 0)
    cand_swaps = dict(cand_qc.count_ops()).get("swap", 0)
    
    if cand_swaps != ref_swaps:
        # SWAPs were inserted or cancelled -> likely a routing transformation
        return True
        
    graph_diff = compare_interaction_graphs(ref_qc, cand_qc)
    if graph_diff["num_added"] > 0 or graph_diff["num_removed"] > 0:
        # The interaction graph changed, which could mean qubits were mapped to a topology
        # and interactions were bridged by ancillas/swaps.
        return True
        
    return False
