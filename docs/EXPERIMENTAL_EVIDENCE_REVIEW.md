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
| **E1** | Basis rewrite (`H` -> `Ry+Z`) | Equivalent | `not_equivalent` | 1 (Logical) | *Discrepancy:* The manual mathematical rewrite in the builder was incorrect (likely a missing global phase). QCEC accurately caught the error. Acceptance: **FAIL**. |
| **E2** | Synthesis optimization | Equivalent | `equivalent` | 3 (Routing) | *Limitation:* The synthesis pass removed redundant entangling gates, removing graph edges. The routing heuristic saw graph mutations and greedily flagged it as Routing (Cat 3) instead of Synthesis (Cat 5). |
| **E3** | SWAP Routing | Equivalent | `equivalent` | 3 (Routing) | Accurately captured SWAP insertion and topology shifts. |
| **E4** | Identity insertion (`X*3`) | Equivalent | `equivalent` | 6 (Resource) | Successfully flagged as a pure resource spike (depth +2) without routing signatures. |
| **E5** | Measurement Mapping | Inconclusive | `not_equivalent` | 1 (Logical) | *Discrepancy:* QCEC returned `not_equivalent` rather than `inconclusive` because partial equivalence checking was off, leading to a strict logical fail. Acceptance: **FAIL**. |
| **E6** | Detour Routing | Equivalent | `equivalent` | 3 (Routing) | Correctly caught topological routing without naive SWAP usage. |

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
- **Profile Value Add:** Separates topological mutations (interaction graph) and basis translations (JS divergence) from raw depth tracking.
- **Observations Demonstrated:** The framework deterministically catches resource spikes (E4) and topological routing (E3).
- **Falsified Hypotheses:** The hypothesis that the current routing heuristic (Category 3) perfectly isolates topology passes is falsified by **E2**, where a pure optimization pass removed a graph edge, falsely triggering the routing rule.
- **Novelty:** The framework is not a novel solver; it is a highly defensible, interpretable *integration and empirical evaluation framework*.

## 6. Three Prioritized Next Experiments
1. **Fix E1 & E5 Constructors:** Correct the mathematical global phase in E1 to achieve equivalence, and enable `partial_equivalence_checking` in QCEC for E5 to accurately test the `inconclusive` path.
2. **Refine Routing Heuristic:** Differentiate graph *sparsification* (optimization removing redundant entanglement) from graph *densification/bridging* (routing).
3. **Scale Legitimate Corpus:** Introduce 50-100 real-world QASM benchmarks (e.g., Qiskit Benchmarks) to accurately measure the frequency of Category 7 (Unexplained) results in the wild.
