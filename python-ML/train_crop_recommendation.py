"""Train a crop recommendation classifier from `Crop_recommendation.csv`.

Creates a trained RandomForest model and saves evaluation info.

Usage (example):
    python train_crop_recommendation.py --csv Crop_recommendation.csv --out-dir artifacts

This script is intentionally small and dependency-light. It will:
- load CSV with pandas
- basic preprocessing (no-op for numeric features, label-encode target)
- split train/test
- standardize features
- train RandomForestClassifier
- save model, label encoder and a small evaluation report
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler


def load_dataset(path: str | Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df


def prepare_features(df: pd.DataFrame):
    # assume columns N,P,K,temperature,humidity,ph,rainfall,label
    features = [c for c in df.columns if c != "label"]
    X = df[features].copy()
    y = df["label"].copy()
    return X, y, features


def train(args: argparse.Namespace) -> int:
    csv_path = Path(args.csv)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading {csv_path}")
    df = load_dataset(csv_path)
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

    # save artifacts
    model_path = out_dir / "crop_model.joblib"
    scaler_path = out_dir / "scaler.joblib"
    label_path = out_dir / "label_encoder.joblib"
    report_path = out_dir / "evaluation.json"

    print(f"Saving model to {model_path}")
    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(le, label_path)

    with open(report_path, "w", encoding="utf8") as fh:
        json.dump(report, fh, indent=2)

    print("Training complete. Artifacts:")
    for p in (model_path, scaler_path, label_path, report_path):
        print(" -", p)

    # also print a readable classification report
    print("\nClassification report:\n")
    print(classification_report(y_test, preds, target_names=le.classes_))

    return 0


def build_argparser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Train crop recommendation classifier")
    p.add_argument("--csv", default="Crop_recommendation.csv", help="Path to CSV file")
    p.add_argument("--out-dir", default="artifacts", help="Where to write model and reports")
    p.add_argument("--test-size", type=float, default=0.2, help="Test set fraction")
    p.add_argument("--random-state", type=int, default=42)
    p.add_argument("--n-estimators", type=int, default=200)
    return p


if __name__ == "__main__":
    args = build_argparser().parse_args()
    raise SystemExit(train(args))
