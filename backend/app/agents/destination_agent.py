import json
from pathlib import Path


def find_destinations(profile):
    """
    Finds and filters destinations matching user constraints.
    Supports intelligent relaxation when zero strict matches are found.
    """
    path = Path(__file__).resolve().parents[3] / "data" / "sample_destinations.json"
    with open(path, "r", encoding="utf-8") as f:
        destinations = json.load(f)

    max_hours = profile.get("max_travel_hours", 8)
    user_interests = set(profile.get("interests", []))

    strict_matches = []
    relaxed_candidates = []

    for d in destinations:
        dest_acts = set(d.get("activities", []))
        overlap = len(user_interests.intersection(dest_acts))
        # Even if user selected 0 matching interests, base matching score exists
        match_count = overlap if overlap > 0 else 1

        d_copy = dict(d)
        d_copy["interest_match"] = match_count

        if d_copy["travel_hours"] <= max_hours:
            if overlap > 0 or len(user_interests) == 0:
                strict_matches.append(d_copy)
            else:
                relaxed_candidates.append(d_copy)
        else:
            # Candidate for relaxation suggestion
            diff = d_copy["travel_hours"] - max_hours
            d_copy["extra_hours_needed"] = diff
            relaxed_candidates.append(d_copy)

    if strict_matches:
        return strict_matches

    # If no strict match found, relax travel time by up to 2 hours and return candidates with relaxation notice
    fallback_matches = []
    for cand in relaxed_candidates:
        if cand.get("travel_hours", 10) <= max_hours + 2:
            cand["is_relaxed_match"] = True
            cand["relaxation_reason"] = (
                f"Slightly exceeds your {max_hours}h limit by {cand.get('travel_hours') - max_hours}h, "
                f"but offers great scenic value."
            )
            fallback_matches.append(cand)

    return fallback_matches if fallback_matches else destinations[:2]