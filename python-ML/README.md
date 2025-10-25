# Crop recommendation training

This folder contains a small training script to build a crop recommendation
classifier from `Crop_recommendation.csv`.

Files added:

- `train_crop_recommendation.py` — training script. Trains a RandomForest and
  writes `crop_model.joblib`, `scaler.joblib`, `label_encoder.joblib`, and
  `evaluation.json` to an output directory (default `artifacts`).
- `requirements.txt` — minimal Python dependencies.
- `data.py` — small constants used by `validators.py`.

Quick start (PowerShell):

```powershell
cd python-ML
python -m pip install -r requirements.txt
python train_crop_recommendation.py --csv Crop_recommendation.csv --out-dir artifacts
```

Notes:

- The script uses numeric features N,P,K,temperature,humidity,ph,rainfall.
- If you want a different model or preprocessing, edit
  `train_crop_recommendation.py` and optionally add a small unit test.

Next steps:

- Run the script locally to produce artifacts.
- Optionally add hyperparameter tuning and cross-validation.
