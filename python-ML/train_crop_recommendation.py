"""
Trains on:
- "temperature"
- "humidity"
- "ph"
- "rainfall"
target column "label".

Usage:
    python train_crop_recommendation.py --csv Crop_recommendation.csv --out-dir artifacts

Artifacts:
- artifacts/crop_model.joblib
- artifacts/scaler.joblib
- artifacts/label_encoder.joblib
- artifacts/evaluation.json
- artifacts/training_meta.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler


# --- Configuration ---
REQUIRED_FEATURES = ["temperature", "humidity", "ph", "rainfall"]
TARGET_COLUMN = "label"
DROP_COLUMNS = ["N", "P", "K"]


# --- Data loading & preparation ---
def load_dataset(path: str | Path) -> pd.DataFrame:
    """Load CSV and drop any unused columns (N, P, K) if present."""
    df = pd.read_csv(path)
    to_drop = [c for c in DROP_COLUMNS if c in df.columns]
    if to_drop:
        df = df.drop(columns=to_drop)
    return df


def prepare_features(df: pd.DataFrame):
    """Validate columns and return (X, y, feature_names) using REQUIRED_FEATURES only."""
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing target column '{TARGET_COLUMN}'. Found: {list(df.columns)}")
    missing = [c for c in REQUIRED_FEATURES if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required feature columns: {missing}. CSV has: {list(df.columns)}")

    X = df[REQUIRED_FEATURES].copy()
    for c in REQUIRED_FEATURES:
        X[c] = pd.to_numeric(X[c], errors="raise")
    y = df[TARGET_COLUMN].copy()

    mask = ~(X.isna().any(axis=1) | y.isna())
    if mask.sum() < len(df):
        X = X.loc[mask].reset_index(drop=True)
        y = y.loc[mask].reset_index(drop=True)

    return X, y, REQUIRED_FEATURES


# --- Training pipeline ---
def train(args: argparse.Namespace) -> int:
    """End-to-end training and artifact writing."""
    csv_path = Path(args.csv)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading {csv_path}")
    df = load_dataset(csv_path)

    print("Preparing features")
    X, y, feature_names = prepare_features(df)

    print("Encoding labels and splitting data")
    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=args.test_size, random_state=args.random_state, stratify=y_enc
    )

    print("Scaling features")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training RandomForestClassifier")
    clf = RandomForestClassifier(n_estimators=args.n_estimators, random_state=args.random_state)
    clf.fit(X_train_scaled, y_train)

    print("Evaluating model")
    preds = clf.predict(X_test_scaled)
    report = classification_report(y_test, preds, target_names=le.classes_, output_dict=True)
    printable_report = classification_report(y_test, preds, target_names=le.classes_)

    model_path = out_dir / "crop_model.joblib"
    scaler_path = out_dir / "scaler.joblib"
    label_path = out_dir / "label_encoder.joblib"
    report_path = out_dir / "evaluation.json"
    meta_path = out_dir / "training_meta.json"

    print(f"Saving model to {model_path}")
    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(le, label_path)

    with open(report_path, "w", encoding="utf8") as fh:
        json.dump(report, fh, indent=2)

    meta = {
        "features_in_order": feature_names,
        "target": TARGET_COLUMN,
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "random_state": args.random_state,
        "n_estimators": args.n_estimators,
        "test_size": args.test_size,
        "csv_path": str(csv_path),
        "dropped_columns": [c for c in DROP_COLUMNS if c not in REQUIRED_FEATURES],
    }
    with open(meta_path, "w", encoding="utf8") as fh:
        json.dump(meta, fh, indent=2)

    print("Training complete. Artifacts:")
    for p in (model_path, scaler_path, label_path, report_path, meta_path):
        print(" -", p)

    print("\nClassification report:\n")
    print(printable_report)
    return 0


# --- CLI ---
def build_argparser() -> argparse.ArgumentParser:
    """Build the CLI argument parser."""
    p = argparse.ArgumentParser(description="Train crop recommendation classifier (temp, humidity, ph, rainfall)")
    p.add_argument("--csv", default="python-ML/Crop_recommendation.csv", help="Path to CSV file")
    p.add_argument("--out-dir", default="artifacts", help="Where to write model and reports")
    p.add_argument("--test-size", type=float, default=0.2, help="Test set fraction")
    p.add_argument("--random-state", type=int, default=42, help="Random seed for reproducibility")
    p.add_argument("--n-estimators", type=int, default=200, help="Number of trees in RandomForest")
    return p


if __name__ == "__main__":
    args = build_argparser().parse_args()
    raise SystemExit(train(args))
