"""
Reproducible script to run the same cleaning pipeline as the notebook.
Usage:
    python instagram_cleaning_reusable.py --input ../dataset/Instagram.csv --out ../dataset/Instagram_cleaned.csv
"""
import argparse
from pathlib import Path
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler, RobustScaler


def load_and_prepare(input_path):
    df = pd.read_csv(input_path)
    rename_map = {
        'profile pic': 'profile_pic',
        'nums/length username': 'username_num_length',
        'fullname words': 'fullname_words',
        'nums/length fullname': 'fullname_num_length',
        'name==username': 'name_eq_username',
        'description length': 'description_length',
        'external URL': 'external_url',
        'private': 'private',
        '#posts': 'num_posts',
        '#followers': 'num_followers',
        '#follows': 'num_follows',
        'fake': 'fake',
        'followers_following_ratio': 'followers_following_ratio'
    }
    df = df.rename(columns=rename_map)
    df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
    return df


def coerce_and_impute(df):
    candidate_numeric = ['profile_pic','username_num_length','fullname_words','fullname_num_length',
                         'name_eq_username','description_length','external_url','private',
                         'num_posts','num_followers','num_follows','fake','followers_following_ratio']
    numeric_cols = [c for c in candidate_numeric if c in df.columns]
    for c in numeric_cols:
        df[c] = pd.to_numeric(df[c], errors='coerce')
        df[c] = df[c].fillna(df[c].median())
    for flag in ['profile_pic','name_eq_username','external_url','private','fake']:
        if flag in df.columns:
            df[flag] = df[flag].astype(int)
    return df, numeric_cols


def detect_and_cap(df, numeric_cols):
    outlier_info = {}
    for c in numeric_cols:
        q1 = df[c].quantile(0.25)
        q3 = df[c].quantile(0.75)
        iqr = q3 - q1
        lb = q1 - 1.5 * iqr
        ub = q3 + 1.5 * iqr
        p1 = df[c].quantile(0.01)
        p99 = df[c].quantile(0.99)
        outlier_info[c] = dict(iqr_lb=lb, iqr_ub=ub, p1=p1, p99=p99)
        df[c + '_outlier_iqr'] = ((df[c] < lb) | (df[c] > ub)).astype(int)
        df[c + '_outlier_p'] = ((df[c] < p1) | (df[c] > p99)).astype(int)
        df[c + '_orig'] = df[c].copy()
        df[c + '_capped'] = df[c].clip(lower=p1, upper=p99)
    return df, outlier_info


def feature_engineer(df):
    if 'num_followers_capped' in df.columns:
        df['log_num_followers'] = np.log1p(df['num_followers_capped'])
    if 'num_posts_capped' in df.columns:
        df['log_num_posts'] = np.log1p(df['num_posts_capped'])
    if 'followers_following_ratio' in df.columns:
        cap = df['followers_following_ratio'].quantile(0.999)
        df['followers_following_ratio_clipped'] = df['followers_following_ratio'].clip(upper=cap)
    return df


def drop_redundant_capped_flags(df):
    """
    If both `col` and `col_capped` exist and `col` is binary (0/1), drop `col_capped` as redundant.
    Returns modified df and list of dropped columns.
    """
    dropped = []
    capped_cols = [c for c in df.columns if c.endswith('_capped')]
    for c in capped_cols:
        base = c[:-7]
        if base in df.columns:
            try:
                vals = pd.unique(df[base].dropna())
                # consider as binary if values subset of {0,1}
                if set(vals).issubset({0, 1}):
                    df.drop(columns=[c], inplace=True)
                    dropped.append(c)
            except Exception:
                continue
    if dropped:
        print('Dropped redundant capped columns for binary flags:', dropped)
    return df, dropped


def scale_and_save(df, numeric_cols, artifacts_dir, data_dir):
    # deduplicate while preserving order without using pd.unique on a list
    scale_candidates = [c + '_capped' for c in numeric_cols] + [c for c in df.columns if c.startswith('log_') or c.endswith('_clipped')]
    seen = {}
    dedup = []
    for item in scale_candidates:
        if item not in seen:
            seen[item] = True
            dedup.append(item)
    scale_cols = [c for c in dedup if c in df.columns and c != 'fake']
    scaler_std = StandardScaler()
    scaler_rob = RobustScaler()
    X_std = scaler_std.fit_transform(df[scale_cols]) if scale_cols else None
    X_rob = scaler_rob.fit_transform(df[scale_cols]) if scale_cols else None
    df_std = df.copy()
    df_rob = df.copy()
    if scale_cols:
        for i, c in enumerate(scale_cols):
            df_std[c + '_std'] = X_std[:, i]
            df_rob[c + '_rob'] = X_rob[:, i]
    joblib.dump(scaler_std, artifacts_dir / 'scaler_standard.pkl')
    joblib.dump(scaler_rob, artifacts_dir / 'scaler_robust.pkl')
    df.to_csv(data_dir / 'Instagram_cleaned.csv', index=False)
    df_std.to_csv(data_dir / 'Instagram_cleaned_scaled_standard.csv', index=False)
    df_rob.to_csv(data_dir / 'Instagram_cleaned_scaled_robust.csv', index=False)
    return


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=str, default='../dataset/Instagram.csv')
    parser.add_argument('--data-dir', type=str, default='../dataset')
    parser.add_argument('--artifacts-dir', type=str, default='../artifacts')
    args = parser.parse_args()
    data_dir = Path(args.data_dir)
    artifacts_dir = Path(args.artifacts_dir)
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    df = load_and_prepare(Path(args.input))
    df, numeric_cols = coerce_and_impute(df)
    df, outlier_info = detect_and_cap(df, numeric_cols)
    df = feature_engineer(df)
    scale_and_save(df, numeric_cols, artifacts_dir, data_dir)
    print('Cleaning + scaling complete. Outputs saved to', data_dir, 'and', artifacts_dir)

if __name__ == '__main__':
    main()
