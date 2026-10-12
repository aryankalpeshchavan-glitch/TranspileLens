import json
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field

from transpilelens.profiler.semantic import SemanticResult
from transpilelens.profiler.resources import ResourceProfile
from transpilelens.profiler.interaction_graph import InteractionGraphProfile

class ProfileMetadata(BaseModel):
    source_identifier: str
    reference_identifier: str
    candidate_identifier: str
    qiskit_version: Optional[str] = None
    qcec_version: Optional[str] = None
    python_version: Optional[str] = None
    run_timestamp: Optional[str] = None
    optimization_level: Optional[int] = None
    seed: Optional[int] = None
    schema_version: str = "1.0.0"

class ResourceDelta(BaseModel):
    reference: ResourceProfile
    candidate: ResourceProfile
    deltas: Dict[str, Any]

class GraphDelta(BaseModel):
    reference: InteractionGraphProfile
    candidate: InteractionGraphProfile
    added_edges: List[List[int]]
    removed_edges: List[List[int]]

class GateDistributionDelta(BaseModel):
    reference: Dict[str, float]
    candidate: Dict[str, float]
    js_divergence: float

class MeasurementDelta(BaseModel):
    identical_mapping: bool
    mapping_differences_exist: bool

class RoutingEvidence(BaseModel):
    is_routing_consistent: bool

class InterfaceCheck(BaseModel):
    check_name: str
    status: str
    evidence: Dict[str, Any]
    explanation: str

class InterfaceValidation(BaseModel):
    checks: List[InterfaceCheck]


class Interpretation(BaseModel):
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    evidence: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)

class DeltaProfile(BaseModel):
    metadata: ProfileMetadata
    semantic: SemanticResult
    resources: ResourceDelta
    interaction_graph: GraphDelta
    gate_distribution: GateDistributionDelta
    measurement: MeasurementDelta
    routing: RoutingEvidence
    interface_validation: Optional[InterfaceValidation] = None
    interpretation: Optional[Interpretation] = None

    def to_json(self) -> str:
        return self.model_dump_json(indent=2)
