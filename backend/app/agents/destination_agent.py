import json
from pathlib import Path


def find_destinations(profile):

    path = Path(__file__).resolve().parents[3] / "data" / "sample_destinations.json"

    with open(path, "r") as f:
        destinations = json.load(f)

    result = []

    for d in destinations:

        if d["travel_hours"] > profile["max_travel_hours"]:
            continue

        match = 0

        for interest in profile["interests"]:
            if interest in d["activities"]:
                match += 1

        if match > 0:
            d["interest_match"] = match
            result.append(d)

    return result