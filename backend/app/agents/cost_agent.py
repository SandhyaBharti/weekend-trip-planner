from app.utils.cost import calculate_cost


def analyze_cost(destinations, profile):

    for destination in destinations:
        destination["cost"] = calculate_cost(
            destination,
            profile
        )

    return destinations