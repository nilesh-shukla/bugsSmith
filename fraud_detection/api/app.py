from pathlib import Path
import importlib.util
import json
import joblib
import pandas as pd
import numpy as np
import re
from datetime import datetime, timezone
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


def get_confidence_percent(prob: float) -> int:
    """Return a confidence percentage from model probability.

    Uses the larger side of the class probability (distance from 0.5).
    """
    try:
        return int(round(max(prob, 1.0 - prob) * 100))
    except Exception:
        return 0


def get_feature_contributions(df_row: pd.DataFrame):
    """Return a dict of feature -> contribution weight (normalized).

    Prefer explanation module if provided. Otherwise use model attributes
    like feature_importances_ or coef_. Returned values are relative
    weights (sum to 1) when available.
    """
    # try explanation module
    try:
        if explanation and hasattr(explanation, "feature_contributions"):
            return explanation.feature_contributions(df_row.iloc[0].to_dict()) or {}
        if explanation and hasattr(explanation, "generate_feature_contributions"):
            return explanation.generate_feature_contributions(df_row.iloc[0].to_dict()) or {}
    except Exception:
        pass

    # fallback to model attributes
    try:
        # feature_importances_ (tree-based)
        if hasattr(model, 'feature_importances_'):
            imps = list(model.feature_importances_)
            names = list(df_row.columns)
            total = sum(imps) or 1.0
            out = {n: float(i / total) for n, i in zip(names, imps)}
            return out

        # linear coeffs
        if hasattr(model, 'coef_'):
            coef = model.coef_
            # coef_ may be 2D (n_classes, n_features)
            arr = coef[0] if hasattr(coef, '__len__') and getattr(coef, '__len__') and hasattr(coef[0], '__len__') else coef
            arr = [abs(float(x)) for x in arr]
            names = list(df_row.columns)
            total = sum(arr) or 1.0
            out = {n: float(v / total) for n, v in zip(names, arr)}
            return out
    except Exception:
        pass

    return {}


def detect_anomalies(payload: dict):
    """Simple heuristic anomaly detector based on payload values."""
    try:
        anomalies = []
        # basic numeric fields
        followers = _to_int(payload.get('followers', payload.get('follower_count', 0)), 0)
        following = _to_int(payload.get('following', payload.get('following_count', 1)), 1)
        posts = _to_int(payload.get('posts', payload.get('num_posts', 0)), 0)
        pic = payload.get('has_profile_pic', payload.get('profile_pic', None))
        private = payload.get('private', payload.get('accountPrivacy', None))

        username = str(payload.get('username', '') or '')
        fullname = str(payload.get('fullname', payload.get('display_name', '')) or '')
        bio = str(payload.get('bio', payload.get('description', '')) or '')

        # Low-level checks (keep previous behavior)
        if followers < 20:
            anomalies.append('Low followers')
        if posts == 0:
            anomalies.append('No activity')
        if pic is False or (isinstance(pic, str) and pic.strip().lower() in ('no', 'n', 'false', '0')):
            anomalies.append('No profile image')
        if private in (True, 'true', 'True', 'yes', 'Yes'):
            anomalies.append('Private account')

        # Username heuristics
        if username:
            digit_ratio = sum(c.isdigit() for c in username) / max(len(username), 1)
            special_chars = sum(1 for c in username if not c.isalnum())
            if digit_ratio > 0.6:
                anomalies.append('Numeric username')
            if special_chars / max(len(username), 1) > 0.3 or len(username) < 3:
                anomalies.append('Suspicious username pattern')
            if re.search(r'(.)\1{3,}', username):
                anomalies.append('Repetitive characters in username')

        # Bio heuristics
        if bio:
            url_count = len(re.findall(r'https?://', bio, flags=re.IGNORECASE))
            email_like = len(re.findall(r'\S+@\S+\.\S+', bio))
            hashtag_count = bio.count('#')
            non_ascii = sum(1 for c in bio if ord(c) > 127) / max(len(bio), 1)
            repeated_chars = bool(re.search(r'(.)\1{4,}', bio))

            if url_count + email_like + hashtag_count >= 2:
                anomalies.append('Spammy bio')
            if non_ascii > 0.4 or repeated_chars:
                anomalies.append('Bot-like bio')

        # Follow ratio / farming
        ratio = followers / max(following, 1)
        if ratio < 0.1 or ratio > 10:
            anomalies.append('Unusual follower ratio')

        # High followers but low activity
        if followers >= 1000 and posts < 5:
            anomalies.append('High followers, low activity')

        # Missing or auto-generated display name
        if not fullname or fullname.strip() == '' or fullname.strip().lower() == username.strip().lower():
            anomalies.append('Missing display name')

        # New account detection (if created/created_at present)
        created = payload.get('created_at') or payload.get('createdAt') or payload.get('account_created')
        if created:
            try:
                # try parsing ISO-like strings first
                created_dt = None
                if isinstance(created, (int, float)):
                    # assume epoch seconds
                    created_dt = datetime.fromtimestamp(float(created), tz=timezone.utc)
                else:
                    created_dt = datetime.fromisoformat(str(created))
                age_days = (datetime.now(timezone.utc) - created_dt).days
                if age_days >= 0 and age_days < 30:
                    anomalies.append('New account')
            except Exception:
                pass

        # Deduplicate while preserving order
        seen = set()
        ordered = []
        for a in anomalies:
            if a not in seen:
                ordered.append(a)
                seen.add(a)

        return ordered
    except Exception:
        return []


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
    return jsonify({
        "status": "ok"
    })


@app.route("/_app_info", methods=["GET"])
def app_info():
    return jsonify({
        "app_file": __file__
    })


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
    # additional outputs
    confidence = get_confidence_percent(prob if 'prob' in locals() else 0.0)
    feature_contributions = {}
    try:
        feature_contributions = get_feature_contributions(df)
    except Exception:
        feature_contributions = {}

    anomalies = detect_anomalies(payload if isinstance(payload, dict) else {})

    response = {
        "risk_score": score,
        "status": label,
        "input_quality_score": input_quality_score,
        "model_confidence": model_confidence,
        "confidence": confidence,
        "feature_contributions": feature_contributions,
        "anomalies": anomalies,
        "reasons": reasons
    }
    if input_quality_score < 40:
        response["warning"] = "Prediction based on limited profile information"

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
