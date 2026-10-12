# Release Audit Report

**Audit Date:** 2026-10-10
**Commit Audited:** `d9853d9`

## 1. Git & Repository State
- Branch: `main`
- Commit: `d9853d9` verified.
- Working tree was clean prior to audit.

## 2. Reproducibility
- Tested on Python 3.14.2 via a fresh temporary virtual environment.
- Qiskit >= 1.0, MQT QCEC confirmed working.
- **Clean Installation:** `python -m pip install -e .` succeeded. 
- **Tests:** `pytest tests/` successfully passed 35/35 tests with no skips or failures.
- **Experiment Runner:** Executed `python scripts/runner.py` successfully and produced valid JSON outputs representing E1-E6 and L1-L3 deterministically.

## 3. Experiment Results (E1-E6, L1-L3)
- The generated `results.json` accurately models the expected semantic and structural metrics.
- `E1` (Basis rewrite) is proven mathematically and semantically equivalent via QCEC and categorized as synthesis.
- `E2` (Synthesis optimization) is categorized as Category 5 (Synthesis) under general categorization rules prioritizing basis changes and operation reduction over routing heuristics.
- `E5` (Measurement mapping difference) correctly evaluates under the defined equivalence contract without partial equivalence as `not_equivalent` with acceptance `PASS`.
- `Interface Integrity`: Measurement mapping validation explicitly distinguishes missing evidence (unmeasured circuits) with status `missing` from genuine `pass` and `fail` outcomes.
- Results are computed live from the profilers, without hardcoded expected profiles.

## 4. Baselines (B1-B5)
- **B1 (QASM Diff):** Operational, correctly isolating structural line mutations.
- **B2 (Pass Observability):** Implemented but **Unsupported**, strictly documented as limited by post-hoc Qiskit telemetry.
- **B3 (QCEC):** Operational.
- **B4 (Resource Only):** Operational.
- **B5 (TranspileLens Full):** Operational.

## 5. Scientific Claims
- The framework successfully avoids claiming to detect Trojans or malware.
- Category 7 is honestly defined as "Structurally unexplained" rather than malicious.
- Measurement-mapping equivalence limitations and interface integrity are respected.
- No inflated performance/precision metrics are claimed.

## 6. Tests
- 35 Passed, 0 Failed, 0 Errored.
- Metamorphic regression tests rigorously validate equivalent rewrites, identity insertion, inequivalent controls, resource-only deltas, supported routing cases, and interface integrity.

## 7. Documentation (README.md)
- Command instructions (runner, dashboard, tests) are strictly verified to match repo state.
- Known limitations regarding B2 (pass telemetry) and E5 (measurement drift) are openly published.
- The dashboard is self-contained without demanding cloud or GPU constraints.

## 8. Conclusion
**Status:** `PASS`
No critical, major, or minor functional issues found. The codebase strictly adheres to evidence-based analysis over intent fabrication, correctly isolating structural heuristics from semantic proofs.
