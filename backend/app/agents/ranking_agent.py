def rank_destinations(destinations, profile):
    """
    Ranks destination candidates using a Multi-Criteria Decision Analysis (MCDA) model
    combining Interest Match (35%), Budget Feasibility (25%), Weather Suitability (15%),
    Travel Time Efficiency (15%), and User Rating (10%).
    """
    user_interests = profile.get("interests", [])
    num_interests = max(1, len(user_interests))
    max_travel_hours = max(1, profile.get("max_travel_hours", 8))

    for d in destinations:
        # 1. Interest Score
        interest_match = d.get("interest_match", 1)
        interest_score = min(1.0, interest_match / num_interests)

        # 2. Rating Score (Normalized 0 to 1)
        rating_score = min(1.0, d.get("rating", 4.0) / 5.0)

        # 3. Travel Time Efficiency Score
        travel_hours = d.get("travel_hours", 6)
        travel_score = max(0.1, 1.0 - (travel_hours / (max_travel_hours * 1.2)))

        # 4. Weather Score (from weather agent)
        weather_score = d.get("weather_score", 0.85)

        # 5. Budget Score (from cost agent)
        cost_info = d.get("cost", {})
        budget_score = cost_info.get("budget_score", 0.8)

        # MCDA Composite Weighted Formula
        composite_score = (
            (interest_score * 0.35)
            + (budget_score * 0.25)
            + (travel_score * 0.15)
            + (weather_score * 0.15)
            + (rating_score * 0.10)
        )

        d["score"] = round(composite_score, 3)
        d["sub_scores"] = {
            "interest": round(interest_score, 2),
            "budget": round(budget_score, 2),
            "travel": round(travel_score, 2),
            "weather": round(weather_score, 2),
            "rating": round(rating_score, 2)
        }

        # Feasibility Classification
        is_within_budget = cost_info.get("status") == "within_budget"
        has_rain_warning = "Rain" in d.get("weather_warning", "")

        if composite_score >= 0.72 and is_within_budget and not has_rain_warning:
            feasibility_badge = "Top Feasible Match"
            badge_type = "success"
        elif not is_within_budget:
            feasibility_badge = "Budget Caution"
            badge_type = "warning"
        elif has_rain_warning:
            feasibility_badge = "Rain Advisory"
            badge_type = "info"
        else:
            feasibility_badge = "Viable Option"
            badge_type = "neutral"

        d["feasibility_badge"] = feasibility_badge
        d["badge_type"] = badge_type

    destinations.sort(key=lambda x: x["score"], reverse=True)
    return destinations