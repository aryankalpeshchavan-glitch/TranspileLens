# TranspileLens

TranspileLens is a research-oriented quantum circuit transformation profiling framework. It aims to bridge the gap between deterministic semantic equivalence checking and structural observability, helping developers understand *why* and *how* a circuit changed during a compiler pass, beyond merely verifying that it still computes the same function.

## What it Does and Does Not Claim to Do
**Does:**
- Verify semantic equivalence using MQT QCEC (where supported).
- Extract measurable structural properties (resource counts, depths, interaction graphs, gate distributions, and measurement mappings).
- Combine these into a unified JSON `DeltaProfile`.
- Use a deterministic, heuristic rule engine to categorize ordinary transformations based strictly on measured structural evidence (e.g. Synthesis, Optimization, Routing).

**Does Not Do:**
- Claim novelty in equivalence checking (it relies entirely on QCEC for semantics).
- Fabricate intent. It reports structural similarity (e.g., "densified interaction graph with SWAPs"), not pass intent ("the compiler ran SabredRouting").
- Identify malware, "Trojans", or malicious attacks. A structurally unexplained transformation (Category 7) is simply a transformation not modeled by the existing heuristics.

## Architecture and Data Flow
```text
[Reference Circuit] & [Candidate Circuit]
         |
         v
1. Semantic Checker (QCEC) -> SemanticResult (Equivalent / Inconclusive)
2. Structural Profilers (Resources, Graph, Gate Dist, Measurement, Routing Heuristics)
         |
         v
[Delta Profile Schema] (JSON serializable contract)
         |
         v
[Deterministic Categorizer] (Rule Engine)
         |
         v
[Aggregated JSON Results] -> [Dashboard (dashboard.html)]
```

## Comparison Baselines
TranspileLens evaluates itself against 5 distinct baselines:
1. **Raw QASM Diff (B1):** Line-by-line textual diffing using `qiskit.qasm2`.
2. **Pass Observability (B2):** Simulates external logger access (currently unsupported/limited post-hoc).
3. **QCEC Only (B3):** Pure semantic equivalence status.
4. **Resource-Only (B4):** Tracks only gate counts and depth.
5. **Full TranspileLens (B5):** The full profile and categorizer.

## Experimental Corpus
The framework executes an artificial corpus (E1-E6) to test boundary conditions and a legitimate corpus (L1-L3) to model real-world transpilation workloads.

## Installation & Environment
Tested on Windows, Python 3.14.2, Qiskit 1.2+, and MQT QCEC.
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install .
```

### Frontend Platform
The platform uses React and Vite. Node.js is required.
```bash
cd frontend
npm install
npm run build
npm run dev
```

## Commands
**Run Backend Tests:**
```bash
.\.venv\Scripts\pytest tests\
```

**Generate Results (Backend):**
```bash
.\.venv\Scripts\python scripts/runner.py --corpus ALL --output results.json
# To view in frontend, copy to public:
copy results.json frontend\public\results.json
```

**View Dashboard:**
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

## Scientific Findings and Limitations
- **Findings (RQ1-RQ4):** 
  - Structural analysis (B5) succeeds in differentiating synthesis (Category 5) from standard depth-optimization (Category 4) in legitimate passes where QCEC (B3) only reports "equivalent", and QASM text diffs (B1) report hundreds of arbitrary line edits.
- **Limitations:**
  - **Measurement Drift:** QCEC mapping constraints mean that drastically altered physical-to-classical interfaces (E5) currently report as `INCONCLUSIVE` instead of proven equivalent. TranspileLens preserves this limitation instead of overriding it.
  - **Routing Heuristic:** The routing rule relies on a greedy structural heuristic (SWAP observation or graph densification). It does not perfectly model complex non-SWAP routing.
