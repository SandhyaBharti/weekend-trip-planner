def plan_activities_for_destination(destination, profile, weather_info=None):
    """
    Selects and schedules weather-aware activities from destination highlights
    and user interests, dividing them into Morning, Afternoon, and Evening slots.
    """
    highlights = destination.get("highlights", [])
    if not highlights:
        highlights = [
            f"Explore {destination.get('name')} scenic viewpoint",
            f"Local mountain bazaar & cultural walk",
            f"Sunset cafe & traditional dinner"
        ]

    interests = profile.get("interests", [])
    has_rain = False
    if weather_info and isinstance(weather_info, dict):
        precip = weather_info.get("precipitation_sum", [])
        has_rain = any(v > 0.5 for v in precip if isinstance(v, (int, float)))

    days = profile.get("days", 2)
    daily_schedules = []

    for day_num in range(1, days + 1):
        # Index offset to cycle activities logically
        h_len = len(highlights)
        m_act = highlights[(day_num * 2 - 2) % h_len]
        a_act = highlights[(day_num * 2 - 1) % h_len]

        # Weather adaptations
        if has_rain and day_num == 1:
            m_act = f"Visit Tibetan Monasteries & Local Museums (Weather-friendly)"
            e_act = "Cozy Cafe Dining & Handicraft shopping"
        else:
            e_act = f"Sunset viewpoint & traditional local dinner in {destination.get('name')}"

        daily_schedules.append({
            "day": day_num,
            "destination": destination.get("name"),
            "morning": {
                "time": "08:30 AM - 12:00 PM",
                "activity": m_act,
                "type": "Outdoor Explorer" if not has_rain else "Cultural Experience"
            },
            "afternoon": {
                "time": "01:30 PM - 05:00 PM",
                "activity": a_act,
                "type": "Adventure & Nature"
            },
            "evening": {
                "time": "06:00 PM - 08:30 PM",
                "activity": e_act,
                "type": "Leisure & Culinary"
            }
        })

    # Estimate activity fees / equipment per person
    activity_cost_per_person = 400 * len(interests)
    total_activity_cost = activity_cost_per_person * profile.get("people", 2)

    return {
        "daily_schedules": daily_schedules,
        "total_cost": total_activity_cost,
        "activity_cost_per_person": activity_cost_per_person
    }
