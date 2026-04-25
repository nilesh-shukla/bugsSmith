from pathlib import Path
import importlib.util
import json
import joblib
import pandas as pd
import numpy as np
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

def _to_int(value, default=0):
    try:
        return int(value)
    except Exception:
        return default


def preprocess_input(payload: dict) -> dict:
    """Map user-friendly/raw payload keys to model feature names (idempotent)."""
    processed = {}

    pic = payload.get("has_profile_pic", payload.get("profile_pic", None))
    if isinstance(pic, str):
        processed["profile_pic"] = 0 if pic.strip().lower() in ("no", "n", "false", "0") else 1
    else:
        try:
            processed["profile_pic"] = int(pic) if pic is not None else 0
        except Exception:
            processed["profile_pic"] = 0

    username = str(payload.get("username", ""))
    processed["username_num_length_capped"] = sum(c.isdigit() for c in username) / max(len(username), 1)

    bio = str(payload.get("bio", payload.get("description", "")))
    processed["description_length_capped"] = len(bio)

    followers = _to_int(payload.get("followers", payload.get("follower_count", 0)), 0)
    following = _to_int(payload.get("following", payload.get("following_count", 1)), 1)
    processed["followers_following_ratio_clipped"] = followers / max(following, 1)

    processed["num_posts_capped"] = _to_int(payload.get("posts", payload.get("num_posts", 0)), 0)

    processed["num_followers_capped"] = followers
    processed["num_follows_capped"] = following

    processed["log_num_followers"] = np.log1p(followers)
    processed["log_num_posts"] = np.log1p(processed["num_posts_capped"])

    # Preserve any provided model-feature keys
    for k, v in payload.items():
        if k in features:
            processed[k] = v

    return processed


def prepare_row(payload: dict):
    processed = preprocess_input(payload) if isinstance(payload, dict) else {}
    df = pd.DataFrame([processed])
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
        prob = float(model.predict_proba(df_row)[:, 1][0])
        score = int(round(prob * 100))
    else:
        pred = model.predict(df_row)[0]
        prob = float(pred)
        score = int(round(prob * 100))

    low_thr = int(thresholds.get("low", 30))
    med_thr = int(thresholds.get("medium", 70))

    if score >= med_thr:
        label = "High Risk"
    elif score >= low_thr:
        label = "Medium Risk"
    else:
        label = "Low Risk"

    return score, label, prob


def calculate_input_quality(payload: dict) -> int:
    important_fields = [
        "username",
        "fullname",
        "bio",
        "followers",
        "following",
        "posts",
        "has_profile_pic",
        "private",
    ]
    present = 0
    for f in important_fields:
        if f not in payload:
            continue
        v = payload.get(f)
        if v is None:
            continue
        if isinstance(v, str) and str(v).strip() == "":
            continue
        present += 1
    score = round((present / len(important_fields)) * 100)
    return int(score)


def get_model_confidence(risk_score: int, input_quality: int, prob: float) -> str:
    if input_quality < 40:
        return "Low"
    if risk_score >= 85 and input_quality >= 70:
        return "High"
    if prob >= 0.75:
        return "High"
    if prob >= 0.6:
        return "Medium"
    return "Low"


app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/_app_info", methods=["GET"])
def app_info():
    return jsonify({"app_file": __file__})


@app.route("/predict", methods=["POST"])  
def predict():
    payload = request.get_json()
    if payload is None:
        return jsonify({"error": "Invalid JSON payload"}), 400

    try:
        df = prepare_row(payload)
        print("\n========= DEBUG INPUT =========")
        print("Original Payload:")
        print(payload)

        print("\nProcessed DataFrame Sent to Model:")
        print(df)

        print("\nFeature List Expected by Model:")
        print(features)
        if hasattr(model, 'predict_proba'):
            print("\nRaw Model Probability:")
            print(model.predict_proba(df))
        
        print("\n========= END DEBUG =========\n")
        score, label, prob = score_row(df)
    except Exception as e:
        return jsonify({"error": "Scoring failed", "detail": str(e)}), 500

    reasons = []
    try:
        if explanation and hasattr(explanation, "generate_reasons"):
            # pass a plain dict (row) to the rule function
            reasons = explanation.generate_reasons(df.iloc[0].to_dict())
    except Exception:
        reasons = []
        
    input_quality_score = calculate_input_quality(payload if isinstance(payload, dict) else {})
    model_confidence = get_model_confidence(score, input_quality_score, prob if 'prob' in locals() else 0.0)
    response = {
        "risk_score": score,
        "status": label,
        "input_quality_score": input_quality_score,
        "model_confidence": model_confidence,
        "reasons": reasons
    }
    if input_quality_score < 40:
        response["warning"] = "Prediction based on limited profile information"

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
