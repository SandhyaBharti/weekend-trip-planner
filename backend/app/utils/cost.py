def calculate_cost(destination, profile):

    people = profile["people"]
    days = profile["days"]

    # Synthetic cost assumptions
    transport = destination["travel_hours"] * 150 * people
    hotel = 1200 * people * max(1, days - 1)
    food = 500 * people * days
    activities = len(destination["activities"]) * 300 * people

    total = transport + hotel + food + activities

    budget = profile["budget"]

    if total <= budget:
        status = "within_budget"
        difference = budget - total
    else:
        status = "over_budget"
        difference = total - budget

    return {
        "transport": transport,
        "hotel": hotel,
        "food": food,
        "activities": activities,
        "total": total,
        "budget": budget,
        "status": status,
        "difference": difference
    }