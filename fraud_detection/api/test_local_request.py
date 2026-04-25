import requests
import json

URL = "http://127.0.0.1:5000/predict"

sample = {
    # minimal example; missing fields will be set to 0 by the API
    "profile_pic": 0,
    "username_num_length_capped": 1,
    "description_length_capped": 0,
    "followers_following_ratio_clipped": 0.1,
    "num_posts_capped": 3
}

# POST using model-feature keys (backwards-compatible sample)
resp = requests.post(URL, json=sample)
print("Model-feature payload Status:", resp.status_code)
try:
    print(json.dumps(resp.json(), indent=2))
except Exception:
    print(resp.text)

# POST using raw/user-friendly keys (new recommended flow)
raw_sample = {
    "username": "john123",
    "bio": "",
    "followers": 12,
    "following": 500,
    "posts": 1,
    "has_profile_pic": "no"
}

resp2 = requests.post(URL, json=raw_sample)
print("Raw payload Status:", resp2.status_code)
try:
    print(json.dumps(resp2.json(), indent=2))
except Exception:
    print(resp2.text)
