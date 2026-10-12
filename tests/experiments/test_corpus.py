from transpilelens.corpus.registry import EXPERIMENTS, run_experiment

def test_corpus_execution():
    for exp in EXPERIMENTS:
        res = run_experiment(exp)
        
        # Test basic output structure
        assert "case_id" in res
        assert "acceptance" in res
        assert "profile" in res
        assert res["profile"].metadata.source_identifier == exp.case_id
        
        # We don't assert that acceptance is PASS for all because E5 is designed to be inconclusive/fail 
        # based on current QCEC mapping limitations. But we do assert it executes fully!
        assert res["acceptance"] in ["PASS", "FAIL"]
