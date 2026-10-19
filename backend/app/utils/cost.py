import math
from app.agents.transport_agent import calculate_transport_details
from app.agents.accommodation_agent import calculate_accommodation_details


def calculate_cost(destination, profile):
    """
    Computes an itemized financial model with accommodation, transport,
    meals, activities, and emergency buffer.
    """
    people = profile.get("people", 2)
    days = profile.get("days", 2)
    budget = profile.get("budget", 15000.0)
    relationship = profile.get("relationship", "couple").lower()

    # 1. Transport Calculation
    transport_info = calculate_transport_details(destination, profile)
    transport_cost = transport_info.get("cost", int(destination.get("travel_hours", 6) * 150 * people))

    # 2. Accommodation Calculation
    hotel_info = calculate_accommodation_details(destination, profile)
    hotel_cost = hotel_info.get("total_cost", int(1200 * people * max(1, days - 1)))

    # 3. Meals & Dining (Dynamic by group type)
    daily_food_rate = 750 if relationship == "couple" else (600 if relationship == "family" else 500)
    food_cost = int(daily_food_rate * people * days)

    # 4. Activities & Entry fees
    activities_list = destination.get("activities", [])
    activity_rate = 350
    activities_cost = int(len(activities_list) * activity_rate * people)

    # Subtotal and 5% Contingency Buffer
    subtotal = transport_cost + hotel_cost + food_cost + activities_cost
    buffer_cost = int(subtotal * 0.05)
    total = subtotal + buffer_cost

    difference = round(abs(budget - total), 2)
    if total <= budget:
        status = "within_budget"
        optimization_tip = f"Great budget match! You have ₹{int(difference):,} surplus for souvenir shopping or adventure add-ons."
        budget_score = round(min(1.0, 0.85 + (difference / budget) * 0.15), 3)
    else:
        status = "over_budget"
        optimization_tip = (
            f"Over budget by ₹{int(difference):,}. Consider switching to Volvo bus transport "
            f"or choosing budget boutique homestay to save approx ₹{int(difference * 0.8):,}."
        )
        budget_score = round(max(0.1, 1.0 - (difference / budget)), 3)

    return {
        "transport": transport_cost,
        "hotel": hotel_cost,
        "food": food_cost,
        "activities": activities_cost,
        "buffer": buffer_cost,
        "total": total,
        "budget": budget,
        "status": status,
        "difference": difference,
        "per_person": round(total / max(1, people), 2),
        "budget_utilization_pct": round((total / max(1, budget)) * 100, 1),
        "budget_score": budget_score,
        "optimization_tip": optimization_tip,
        "transport_details": transport_info,
        "hotel_details": hotel_info
    }