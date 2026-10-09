import networkx as nx
from qiskit import QuantumCircuit
from typing import Dict, Any
from pydantic import BaseModel

class InteractionGraphProfile(BaseModel):
    num_nodes: int
    num_edges: int
    density: float
    
def build_interaction_graph(qc: QuantumCircuit) -> nx.Graph:
    """
    Builds a documented graph representation of qubit interactions.
    Nodes are qubits (indices).
    Edges represent at least one two-qubit operation between them.
    Repeated interactions are aggregated into a single unweighted edge for this simple initial implementation.
    """
    G = nx.Graph()
    G.add_nodes_from(range(qc.num_qubits))
    
    for instr in qc.data:
        if len(instr.qubits) == 2:
            # Add an edge between the physical/virtual qubit indices
            q1 = qc.find_bit(instr.qubits[0]).index
            q2 = qc.find_bit(instr.qubits[1]).index
            G.add_edge(q1, q2)
            
    return G

def profile_interaction_graph(qc: QuantumCircuit) -> InteractionGraphProfile:
    G = build_interaction_graph(qc)
    num_nodes = G.number_of_nodes()
    num_edges = G.number_of_edges()
    density = nx.density(G) if num_nodes > 1 else 0.0
    
    return InteractionGraphProfile(
        num_nodes=num_nodes,
        num_edges=num_edges,
        density=density
    )

def compare_interaction_graphs(ref_qc: QuantumCircuit, cand_qc: QuantumCircuit) -> Dict[str, Any]:
    G_ref = build_interaction_graph(ref_qc)
    G_cand = build_interaction_graph(cand_qc)
    
    ref_edges = set(G_ref.edges())
    # Normalize edge tuples so (0,1) is the same as (1,0)
    ref_edges = set((min(u, v), max(u, v)) for u, v in ref_edges)
    
    cand_edges = set(G_cand.edges())
    cand_edges = set((min(u, v), max(u, v)) for u, v in cand_edges)
    
    added_edges = cand_edges - ref_edges
    removed_edges = ref_edges - cand_edges
    
    return {
        "added_edges": list(added_edges),
        "removed_edges": list(removed_edges),
        "num_added": len(added_edges),
        "num_removed": len(removed_edges)
    }
