import argparse
import json
import time
from typing import Dict, Any

from transpilelens.corpus.registry import EXPERIMENTS, run_experiment
from transpilelens.corpus.legitimate_corpus import LEGITIMATE_CASES, get_legitimate_builders
from transpilelens.baselines import run_all_baselines

def main():
    parser = argparse.ArgumentParser(description="TranspileLens Experiment Runner")
    parser.add_argument("--corpus", choices=["E", "L", "ALL"], default="ALL", help="Corpus to run")
    parser.add_argument("--output", type=str, default="results.json", help="Output JSON file")
    args = parser.parse_args()
    
    results = {
        "metadata": {
            "timestamp": time.time(),
            "runner_version": "1.0",
        },
        "experiments": [],
        "legitimate": []
    }
    
    if args.corpus in ["E", "ALL"]:
        for exp in EXPERIMENTS:
            print(f"Running {exp.case_id}...")
            res = run_experiment(exp)
            # Serialize profile object to dict so it's JSON serializable
            res["profile"] = json.loads(res["profile"].to_json())
            results["experiments"].append(res)
            
    if args.corpus in ["L", "ALL"]:
        for case in LEGITIMATE_CASES:
            print(f"Running {case.case_id}...")
            ref_builder, cand_builder = get_legitimate_builders(case.case_id)
            ref_qc = ref_builder()
            cand_qc = cand_builder(ref_qc)
            
            baselines = run_all_baselines(ref_qc, cand_qc, case.case_id)
            
            results["legitimate"].append({
                "case_id": case.case_id,
                "name": case.name,
                "baselines": baselines
            })
            
    with open(args.output, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"Results written to {args.output}")

if __name__ == "__main__":
    main()
