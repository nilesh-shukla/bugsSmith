def generate_reasons(row):
    reasons = []
    if row.get('profile_pic') == 0:
        reasons.append('No profile picture')
    if row.get('username_num_length_capped', 0) > 0.5:
        reasons.append('Digit-heavy username')
    if row.get('description_length_capped') == 0:
        reasons.append('Empty bio')
    if row.get('followers_following_ratio_clipped', 1.0) < 0.2:
        reasons.append('Suspicious follower/following ratio')
    if row.get('num_posts_capped', 9999) < 5:
        reasons.append('Very low posting activity')
    return reasons
