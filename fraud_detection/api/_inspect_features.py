import joblib
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "artifacts" / "deployment" / "model_features.pkl"
print("Checking:", p)
obj = joblib.load(p)
print("Type:", type(obj))
try:
    print("Length:", len(obj))
except Exception:
    print("Length: n/a")
try:
    sample = obj[:50]
    print("Sample (first 50):", sample)
except Exception as e:
    print("Could not slice sample:", e)
