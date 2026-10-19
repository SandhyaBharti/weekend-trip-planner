def analyze_requirements(trip):
    """
    Validates and standardizes trip parameters into a rich traveler profile.
    Performs boundary checks and calculates derived budgeting metrics.
    """
    if not trip.location or not trip.location.strip():
        return {"error": "Starting location cannot be empty."}

    if trip.budget < 1000:
        return {"error": "Budget must be at least ₹1,000 for a weekend getaway."}

    if trip.days <= 0 or trip.days > 14:
        return {"error": "Trip duration must be between 1 and 14 days."}

    if trip.people <= 0 or trip.people > 30:
        return {"error": "Number of travelers must be between 1 and 30."}

    if trip.max_travel_hours <= 0 or trip.max_travel_hours > 24:
        return {"error": "Maximum one-way travel hours must be between 1 and 24."}

    # Normalize relationship
    rel = (trip.relationship or "friends").strip().lower()
    if rel not in ["couple", "friends", "family", "solo"]:
        rel = "friends"

    # Default interests if none provided
    interests = [i.strip().lower() for i in (trip.interests or []) if i.strip()]
    if not interests:
        interests = ["mountains", "nature"]

    per_person_budget = round(trip.budget / trip.people, 2)
    daily_budget_per_person = round(trip.budget / (trip.days * trip.people), 2)

    return {
        "starting_location": trip.location.strip(),
        "budget": float(trip.budget),
        "days": int(trip.days),
        "people": int(trip.people),
        "relationship": rel,
        "interests": interests,
        "max_travel_hours": int(trip.max_travel_hours),
        "start_date": str(trip.start_date),
        "accommodation_tier": getattr(trip, "accommodation_tier", "comfortable") or "comfortable",
        "transport_mode": getattr(trip, "transport_mode", "cab_or_car") or "cab_or_car",
        "per_person_budget": per_person_budget,
        "daily_budget_per_person": daily_budget_per_person
    }