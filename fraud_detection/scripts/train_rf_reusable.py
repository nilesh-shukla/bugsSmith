"""
Train RandomForest on the cleaned Instagram dataset and save model + artifacts.
"""
import argparse
from pathlib import Path
import pandas as pd
import joblib
import json
import numpy as np
import joblib as _joblib_deploy
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Deployment thresholds
RISK_THRESHOLDS = {
    "low": 30,
    "medium": 70,
    "high": 100
}


def load_data(path):
    df = pd.read_csv(path)
    assert 'fake' in df.columns, 'Target `fake` missing'
    return df


def select_features(df):
    feature_cols = [
        c
        for c in df.columns
        if (
            c.endswith('_capped')
            or c.startswith('log_')
            or c.endswith('_clipped')
        ) and c not in ['fake', 'fake_capped']
    ]
    for flag in ['profile_pic','private','external_url','name_eq_username']:
        if flag in df.columns and flag not in feature_cols:
            feature_cols.append(flag)
    feature_cols = [c for c in feature_cols if c != 'fake']
    return feature_cols


def generate_reasons(row):
    reasons = []

    # No profile picture
    if row.get('profile_pic') == 0:
        reasons.append('No profile picture')

    # Digit-heavy username (threshold per provided rule)
    if row.get('username_num_length_capped', 0) > 0.5:
        reasons.append('Digit-heavy username')

    # Empty bio
    if row.get('description_length_capped') == 0:
        reasons.append('Empty bio')

    # Suspicious follower/following ratio
    if row.get('followers_following_ratio_clipped', 1.0) < 0.2:
        reasons.append('Suspicious follower/following ratio')

    # Very low posting activity
    if row.get('num_posts_capped', 9999) < 5:
        reasons.append('Very low posting activity')

    return reasons


def train_and_eval(df, feature_cols, artifacts_dir, random_state=42):
    X = df[feature_cols].fillna(0)
    y = df['fake'].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=random_state)
    rf = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=random_state, n_jobs=-1)
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)
    y_prob = rf.predict_proba(X_test)[:, 1]
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, zero_division=0)),
        'recall': float(recall_score(y_test, y_pred, zero_division=0)),
        'f1': float(f1_score(y_test, y_pred, zero_division=0)),
        'roc_auc': float(roc_auc_score(y_test, y_prob))
    }
    # save model and artifacts
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(rf, artifacts_dir / 'rf_model.pkl')
    fi = pd.DataFrame({'feature': feature_cols, 'importance': rf.feature_importances_}).sort_values('importance', ascending=False)
    fi.to_csv(artifacts_dir / 'rf_feature_importances.csv', index=False)
    with open(artifacts_dir / 'rf_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    return rf, metrics


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='../dataset/Instagram_cleaned.csv')
    parser.add_argument('--artifacts', default='../artifacts')
    args = parser.parse_args()
    df = load_data(Path(args.input))
    features = select_features(df)
    rf, metrics = train_and_eval(df, features, Path(args.artifacts))
    print('Training metrics:', metrics)
    # save metrics
    with open(Path(args.artifacts) / 'rf_metrics.json', 'w') as fh:
        json.dump(metrics, fh, indent=2)
    # feature importances
    fi = pd.DataFrame({'feature': features, 'importance': rf.feature_importances_}).sort_values('importance', ascending=False)
    fi.to_csv(Path(args.artifacts) / 'rf_feature_importances.csv', index=False)
    # compute per-row fraud risk and suspicion score and save augmented CSV
    probs = rf.predict_proba(df[features].fillna(0))[:, 1]
    df['fraud_risk_prob'] = probs
    df['fraud_risk_percent'] = (df['fraud_risk_prob'] * 100).round(2)
    outlier_cols = [c for c in df.columns if c.endswith('_outlier_p')]
    df['outlier_count'] = df[outlier_cols].sum(axis=1) if outlier_cols else 0
    df['suspicion_score'] = np.minimum(100, df['fraud_risk_percent'] + 5 * df['outlier_count'])
    # generate human-readable reasons using rule-based function
    df['reasons'] = df.apply(generate_reasons, axis=1)
    # store as semicolon-separated string for CSV readability
    df['reasons'] = df['reasons'].apply(lambda x: '; '.join(x) if isinstance(x, (list, tuple)) and x else '')

    out_path = Path(args.input).parent / 'Instagram_with_risk_scores.csv'
    df.to_csv(out_path, index=False)
    print('Saved augmented CSV to', out_path)

    # --- Save final deployment artifacts ---
    deploy_dir = Path(args.artifacts) / 'deployment'
    deploy_dir.mkdir(parents=True, exist_ok=True)

    # Save trained model and feature list for backend integration
    model_path = deploy_dir / 'fake_profile_detector.pkl'
    features_path = deploy_dir / 'model_features.pkl'
    _joblib_deploy.dump(rf, model_path)
    _joblib_deploy.dump(features, features_path)
    print('Model and features saved successfully to', deploy_dir)

    # Save thresholds as JSON
    with open(deploy_dir / 'risk_thresholds.json', 'w') as fh:
        json.dump(RISK_THRESHOLDS, fh, indent=2)

    # Save a small explanation module that backend can import
    explanation_py = deploy_dir / 'explanation.py'
    explanation_code = '''def generate_reasons(row):
    reasons = []
    if row.get('profile_pic') == 0:
        reasons.append('No profile picture')
    if row.get('username_num_length_capped', 0) > 0.5:
        reasons.append('Digit-heavy username')
    if row.get('description_length_capped') == 0:
        reasons.append('Empty bio')
    if row.get('followers_following_ratio_clipped', 1.0) < 0.2:
        reasons.append('Suspicious follower/following ratio')
    if row.get('num_posts_capped', 9999) < 5:
        reasons.append('Very low posting activity')
    return reasons
'''
    explanation_py.write_text(explanation_code)

if __name__ == '__main__':
    main()
