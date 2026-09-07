def create_itinerary(destinations, profile):

    days = profile["days"]

    if days <= 2:
        count = min(2, len(destinations))
    elif days <= 4:
        count = min(3, len(destinations))
    else:
        count = min(5, len(destinations))

    selected = destinations[:count]

    itinerary = []

    for i in range(days):

        destination = selected[i % len(selected)]

        activities = destination["activities"]

        day_plan = {
            "day": i + 1,
            "destination": destination["name"],
            "activities": activities[:2]
        }

        itinerary.append(day_plan)

    return itinerary