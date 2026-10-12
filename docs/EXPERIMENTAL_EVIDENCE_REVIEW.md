# Experimental Evidence Review

**Date:** 2026-10-10
**Repository State:** `main` branch, commit `250909c` (audit report)
**Environment:** Python 3.14.2, Qiskit 1.2+, MQT QCEC 3.11.0.

## 1. Reproducibility
- The test suite (`pytest tests\`) passes entirely (22/22).
- The experiment runner (`python scripts/runner.py`) executes deterministically without crashing.
- `results.json` was freshly generated and validated against the source logic.

## 2. Experiment Evaluation (E1-E6)
| Case | Transformation | Expected | Actual Semantic | Category | Findings |
|---|---|---|---|---|---|
| **E1** | Basis rewrite (`H` -> `Ry(pi/2) Z`) | Equivalent | `equivalent` | 5 (Synthesis) | *Verified:* Candidate correctly applies Z first followed by Ry(pi/2), mathematically equaling H. QCEC proves equivalence; categorized as basis synthesis (Cat 5). Acceptance: **PASS**. |
| **E2** | Synthesis optimization | Equivalent | `equivalent` | 5 (Synthesis) | *Verified:* General categorizer rule correctly prioritizes basis changes and optimization over routing heuristics. E2 maps to Category 5 (Synthesis). Acceptance: **PASS**. |
| **E3** | SWAP Routing | Equivalent | `equivalent` | 3 (Routing) | Accurately captured SWAP insertion and topology shifts without basis change. Acceptance: **PASS**. |
| **E4** | Identity insertion (`X*3`) | Equivalent | `equivalent` | 6 (Resource) | Successfully flagged as a pure resource spike (depth +2, ops +2) without routing signatures. Acceptance: **PASS**. |
| **E5** | Measurement Mapping | Not Equivalent | `not_equivalent` | 1 (Logical) | *Verified:* Evaluated under defined equivalence contract without partial equivalence. QCEC confirms `not_equivalent` due to interface mismatch; categorized as logical change (Cat 1). Acceptance: **PASS**. |
| **E6** | Detour Routing | Equivalent | `equivalent` | 3 (Routing) | Correctly caught topological detour routing with ancilla bridging. Acceptance: **PASS**. |

## 3. Legitimate Corpus Evaluation (L1-L3)
| Case | Transformation | B1 (QASM) | B3 (QCEC) | B4 (Resource) | Findings |
|---|---|---|---|---|---|
| **L1** | QFT-3 (O1) | 0 lines changed | Equivalent | 0 ops changed | Baseline compilation performed no structural mutations. |
| **L2** | QFT-3 (O3) | 1 line removed | Equivalent | -1 ops | O3 collapsed a redundant phase gate. |
| **L3** | GHZ-4 (O3) | 0 lines changed | Equivalent | 0 ops changed | Already optimal at construction. |

## 4. Baseline Evaluation
- **B1 (QASM Diff):** Fully operational but structurally brittle (reliant on line counts).
- **B2 (Pass Observability):** **Unsupported.** Properly flagged as requiring deep Qiskit telemetry unavailable post-hoc.
- **B3 (QCEC Only):** Fully operational. Proves semantics but provides zero explanatory power for structural mutations.
- **B4 (Resource Only):** Fully operational.
- **B5 (TranspileLens Full):** Fully operational.

## 5. Scientific Contribution Assessment
- **Concrete Problem Addressed:** Bounding structural and resource mutations in quantum compilation while maintaining strict semantic proofs.
- **Profile Value Add:** Separates topological mutations (interaction graph), basis translations (gate vocabulary), and interface validity from raw depth tracking.
- **Observations Demonstrated:** The framework deterministically catches resource spikes (E4), topological routing (E3, E6), and distinguishes missing measurement evidence from passing checks.
- **Categorization Integrity:** The general rule strictly prevents optimization and synthesis from being misclassified as routing when graph changes occur.
- **Novelty:** The framework is not a novel solver; it is a highly defensible, interpretable *integration and empirical evaluation framework*.

## 6. Three Prioritized Next Experiments
1. **Partial Equivalence Mapping:** Explore configurable partial equivalence checking in QCEC for cases with auxiliary or unmeasured garbage qubits.
2. **Coupling Map Constraints:** Test automated coupling-map validation against target hardware topologies (e.g., Heavy-Hex, Linear).
3. **Scale Legitimate Corpus:** Introduce 50-100 real-world QASM benchmarks (e.g., Qiskit Benchmarks) to measure the empirical distribution of categories in compiler pipelines.
