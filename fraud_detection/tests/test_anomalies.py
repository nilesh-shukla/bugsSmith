import importlib.util
import pathlib
import json


def load_app_module():
    p = pathlib.Path(__file__).resolve().parents[2] / 'fraud_detection' / 'api' / 'app.py'
    spec = importlib.util.spec_from_file_location("fd_app", str(p))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_numeric_username_anomaly():
    mod = load_app_module()
    app = mod.app
    client = app.test_client()
    payload = {"username": "1234567890", "followers": 5, "posts": 0, "has_profile_pic": False}
    res = client.post('/predict', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert 'anomalies' in data
    assert 'Numeric username' in data['anomalies']


def test_spammy_bio_anomaly():
    mod = load_app_module()
    app = mod.app
    client = app.test_client()
    payload = {"username": "bot_user", "bio": "Check out http://example.com #promo contact@spam.com", "followers": 50, "posts": 1}
    res = client.post('/predict', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert 'anomalies' in data
    assert 'Spammy bio' in data['anomalies']


if __name__ == '__main__':
    print('Run pytest to execute tests')
