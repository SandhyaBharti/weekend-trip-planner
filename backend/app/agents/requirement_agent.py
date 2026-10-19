def analyze_requirements(trip):

    if trip.budget <= 0:
        return {"error": "Budget must be greater than 0"}

    if trip.days <= 0:
        return {"error": "Days must be greater than 0"}

    if trip.people <= 0:
        return {"error": "Number of people must be greater than 0"}

    if trip.max_travel_hours <= 0:
        return {"error": "Travel hours must be greater than 0"}

    return {
        "starting_location": trip.location,
        "budget": trip.budget,
        "days": trip.days,
        "people": trip.people,
        "relationship": trip.relationship,
        "interests": trip.interests,
        "max_travel_hours": trip.max_travel_hours,
        "start_date": str(trip.start_date)
    }