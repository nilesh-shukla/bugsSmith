from pathlib import Path
import importlib.util
import json
import joblib
import pandas as pd
from flask import Flask, request, jsonify


ROOT = Path(__file__).resolve().parents[1]
DEPLOY = ROOT / "artifacts" / "deployment"
MODEL_PATH = DEPLOY / "fake_profile_detector.pkl"
FEATURES_PATH = DEPLOY / "model_features.pkl"
THRESHOLDS_PATH = DEPLOY / "risk_thresholds.json"
EXPLANATION_PATH = DEPLOY / "explanation.py"


def load_artifacts():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)

    if not FEATURES_PATH.exists():
        raise FileNotFoundError(f"Features file not found at {FEATURES_PATH}")
    features = joblib.load(FEATURES_PATH)

    if not THRESHOLDS_PATH.exists():
        raise FileNotFoundError(f"Thresholds file not found at {THRESHOLDS_PATH}")
    with open(THRESHOLDS_PATH, "r") as fh:
        thresholds = json.load(fh)

    if not EXPLANATION_PATH.exists():
        explanation = None
    else:
        spec = importlib.util.spec_from_file_location(
            "explaination",
            EXPLANATION_PATH
        )

        if spec is None or spec.loader is None:
            raise ImportError(
                f"Could not load explaination module from {EXPLANATION_PATH}"
            )
        explanation = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(explanation)

    return model, features, thresholds, explanation


model, features, thresholds, explanation = load_artifacts()


def prepare_row(payload: dict):
    df = pd.DataFrame([payload])
    # Ensure all expected features exist
    for col in features:
        if col not in df.columns:
            df[col] = pd.NA
    df = df[features]
    # Ensure numeric dtype where possible (coerce non-numeric to NaN)
    for c in df.columns:
        df[c] = pd.to_numeric(df[c], errors="coerce")
    # Fill NaNs with 0 as a pragmatic default for inference
    df = df.fillna(0)
    return df


def score_row(df_row: pd.DataFrame):
    # df_row must have columns in `features` order
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(df_row)[:, 1][0]
        score = int(round(float(prob) * 100))
    else:
        pred = model.predict(df_row)[0]
        score = int(pred * 100)

    low_thr = int(thresholds.get("low", 30))
    med_thr = int(thresholds.get("medium", 70))

    if score >= med_thr:
        label = "High Risk"
    elif score >= low_thr:
        label = "Medium Risk"
    else:
        label = "Low Risk"

    return score, label


app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])  
def predict():
    payload = request.get_json()
    if payload is None:
        return jsonify({"error": "Invalid JSON payload"}), 400

    try:
        df = prepare_row(payload)
        score, label = score_row(df)
    except Exception as e:
        return jsonify({"error": "Scoring failed", "detail": str(e)}), 500

    reasons = []
    try:
        if explanation and hasattr(explanation, "generate_reasons"):
            # pass a plain dict (row) to the rule function
            reasons = explanation.generate_reasons(df.iloc[0].to_dict())
    except Exception:
        reasons = []

    return jsonify({
        "risk_score": score,
        "status": label,
        "reasons": reasons
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
