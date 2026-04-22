# Fraud detection API

Run the Flask inference service (loads saved artifacts from `fraud_detection/artifacts/deployment`).

Requirements:
- Python 3.8+
- `flask`, `pandas`, `joblib`, `scikit-learn` runtime dependencies
- (Optional) `requests` for the test script

Start the service:
```
python fraud_detection/api/app.py
```

Test locally (after service is running):
```
python fraud_detection/api/test_local_request.py
```

Or use curl:
```
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d '{"profile_pic":0}'
```
