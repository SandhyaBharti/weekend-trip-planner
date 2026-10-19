def rank_destinations(destinations, profile):

    for d in destinations:

        interest_score = d["interest_match"] / len(profile["interests"])

        rating_score = d["rating"] / 5

        travel_score = 1 - (
            d["travel_hours"] / profile["max_travel_hours"]
        )

        d["score"] = (
            interest_score * 0.5
            + rating_score * 0.3
            + travel_score * 0.2
        )

    destinations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return destinations