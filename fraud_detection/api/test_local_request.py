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

resp = requests.post(URL, json=sample)
print("Status:", resp.status_code)
try:
    print(json.dumps(resp.json(), indent=2))
except Exception:
    print(resp.text)
