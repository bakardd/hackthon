"""
"""
from __future__ import annotations

import argparse  # import argparse for CLI arguments
import json      # import json to write evaluation report
from pathlib import Path  # import Path for filesystem paths

import joblib  # import joblib to persist sklearn objects
import pandas as pd  # import pandas to load CSV
from sklearn.ensemble import RandomForestClassifier  # classifier
from sklearn.metrics import classification_report  # metrics
from sklearn.model_selection import train_test_split  # train/test split
from sklearn.preprocessing import LabelEncoder, StandardScaler  # encoding + scaling


# define the ONLY columns we will train on
REQUIRED_FEATURES = ["temperature", "humidity", "ph", "rainfall"]
TARGET_COLUMN = "label"


def load_dataset(path: str | Path) -> pd.DataFrame:
    df = pd.read_csv(path)  # read the CSV
    return df  # return dataframe


def prepare_features(df: pd.DataFrame):
    # verify target column exists
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing target column '{TARGET_COLUMN}' in CSV. Found: {list(df.columns)}")

    # compute which required features are present
    missing = [c for c in REQUIRED_FEATURES if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required feature columns: {missing}. CSV has: {list(df.columns)}")

    # select EXACT columns in the enforced order
    X = df[REQUIRED_FEATURES].copy()

    # coerce to numeric (errors='raise' makes failures explicit)
    for c in REQUIRED_FEATURES:
        X[c] = pd.to_numeric(X[c], errors="raise")

    # extract labels
    y = df[TARGET_COLUMN].copy()

    # drop rows with any NaNs across X or y
    mask = ~(X.isna().any(axis=1) | y.isna())
    if mask.sum() < len(df):
        # optional: you could log how many rows were dropped
        X = X.loc[mask].reset_index(drop=True)
        y = y.loc[mask].reset_index(drop=True)

    return X, y, REQUIRED_FEATURES  # return features, target, and feature names


def train(args: argparse.Namespace) -> int:
    csv_path = Path(args.csv)  # coerce to Path
    out_dir = Path(args.out_dir)  # output directory
    out_dir.mkdir(parents=True, exist_ok=True)  # create output dir

    print(f"Loading {csv_path}")  # log loading
    df = load_dataset(csv_path)  # load dataset
    X, y, feature_names = prepare_features(df)  # enforce columns

    print("Encoding labels and splitting data")  # log step
    le = LabelEncoder()  # init label encoder
    y_enc = le.fit_transform(y)  # fit and transform labels

    # stratified split for balanced evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=args.test_size, random_state=args.random_state, stratify=y_enc
    )

    print("Scaling features")  # log step (optional for RF)
    scaler = StandardScaler()  # init scaler
    X_train_scaled = scaler.fit_transform(X_train)  # fit on train, transform
    X_test_scaled = scaler.transform(X_test)  # transform test

    print("Training RandomForestClassifier")  # log step
    clf = RandomForestClassifier(n_estimators=args.n_estimators, random_state=args.random_state)  # init RF
    clf.fit(X_train_scaled, y_train)  # train classifier

    print("Evaluating model")  # log step
    preds = clf.predict(X_test_scaled)  # predict on test
    report = classification_report(y_test, preds, target_names=le.classes_, output_dict=True)  # dict report
    printable_report = classification_report(y_test, preds, target_names=le.classes_)  # pretty text

    # prepare artifact paths
    model_path = out_dir / "crop_model.joblib"  # model file
    scaler_path = out_dir / "scaler.joblib"  # scaler file
    label_path = out_dir / "label_encoder.joblib"  # label encoder file
    report_path = out_dir / "evaluation.json"  # json metrics
    meta_path = out_dir / "training_meta.json"  # metadata (feature list, etc.)

    print(f"Saving model to {model_path}")  # log saving
    joblib.dump(clf, model_path)  # save model
    joblib.dump(scaler, scaler_path)  # save scaler
    joblib.dump(le, label_path)  # save label encoder

    # write evaluation report
    with open(report_path, "w", encoding="utf8") as fh:
        json.dump(report, fh, indent=2)

    # write minimal metadata for future inference sanity checks
    meta = {
        "features_in_order": feature_names,
        "target": TARGET_COLUMN,
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "random_state": args.random_state,
        "n_estimators": args.n_estimators,
        "test_size": args.test_size,
        "csv_path": str(csv_path),
    }
    with open(meta_path, "w", encoding="utf8") as fh:
        json.dump(meta, fh, indent=2)

    print("Training complete. Artifacts:")
    for p in (model_path, scaler_path, label_path, report_path, meta_path):
        print(" -", p)

    print("\nClassification report:\n")
    print(printable_report)

    return 0  # success exit code


def build_argparser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Train crop recommendation classifier")  # init parser
    p.add_argument("--csv", default="Crop_recommendation.csv", help="Path to CSV file")  # csv path
    p.add_argument("--out-dir", default="artifacts", help="Where to write model and reports")  # output dir
    p.add_argument("--test-size", type=float, default=0.2, help="Test set fraction")  # test fraction
    p.add_argument("--random-state", type=int, default=42)  # RNG seed
    p.add_argument("--n-estimators", type=int, default=200)  # RF trees
    return p  # return parser


if __name__ == "__main__":
    args = build_argparser().parse_args()  # parse CLI args
    raise SystemExit(train(args))  # run training and exit with code
