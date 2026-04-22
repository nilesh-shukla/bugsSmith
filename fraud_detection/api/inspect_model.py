import traceback
from pathlib import Path
import os

MODEL = Path(__file__).resolve().parents[1] / "artifacts" / "deployment" / "fake_profile_detector.pkl"

print("Model path:", MODEL)
print("Exists:", MODEL.exists())
if MODEL.exists():
    print("Size (bytes):", MODEL.stat().st_size)
    with open(MODEL, "rb") as f:
        head = f.read(256)
    try:
        print("Head bytes (utf-8 safe):", head.decode('utf-8', errors='replace')[:200])
    except Exception:
        print("Could not decode head bytes")

import joblib
try:
    obj = joblib.load(MODEL)
    print("Loaded object type:", type(obj))
except Exception as e:
    print("joblib.load raised:")
    traceback.print_exc()

try:
    import pickle
    with open(MODEL, 'rb') as f:
        pickle.load(f)
    print('pickle.load succeeded')
except Exception:
    print('pickle.load failed:')
    traceback.print_exc()
