from app.agents.activity_agent import plan_activities_for_destination


def create_itinerary(destinations, profile):
    """
    Synthesizes a realistic, day-by-day weekend itinerary with time slots,
    meal suggestions, weather precautions, and packing essentials.
    """
    days = profile.get("days", 2)
    relationship = profile.get("relationship", "couple").lower()

    if not destinations:
        return []

    # Select the primary destination (highest ranked match)
    primary_dest = destinations[0]
    dest_name = primary_dest.get("name", "Hill Haven")
    weather_info = primary_dest.get("weather", {})
    daily_weather = weather_info.get("temperature_2m_max", [])

    # Get activities from activity agent
    activity_data = plan_activities_for_destination(primary_dest, profile, weather_info)
    daily_schedules = activity_data.get("daily_schedules", [])

    itinerary = []

    # Curated meal suggestions
    cuisines = {
        "Dharamshala": ("Tibetan Steamed Momos & Thukpa", "Bhagsu Cake & Himalayan Herbal Tea", "Clay-oven Woodfired Pizza"),
        "Manali": ("Traditional Himachali Siddu & Ghee", "Trout Fish with Mountain Herbs", "Cozy Cedar Wood Cafe Dinner"),
        "Rishikesh": ("Ayurvedic Sattvic Thali", "Riverfront Israeli Falafel Platter", "Ganges Sunset Ganga View Thali"),
        "Dalhousie": ("Himachali Madra & Rice", "Pine Grove Picnic Snacks", "Scottish Colonial Bakery Delights"),
        "Kasol": ("Israeli Shakshuka & Fresh Hummus", "Parvati Riverside Maggi & Chai", "Bonfire Cafe Gathering with Wood-Fired Crepes"),
        "Shimla": ("Chana Madra & Bhey", "Mall Road Soft Serve & Patties", "Heritage Balcony Dining"),
        "Mussoorie": ("Pahadi Daal & Steamed Rice", "Char Dukan Waffles & Ginger Tea", "Mall Road Tibetan Momos")
    }

    meal_triplet = cuisines.get(dest_name, ("Local Mountain Breakfast", "Regional Valley Lunch", "Scenic Dinner"))

    for i in range(days):
        day_num = i + 1
        schedule = daily_schedules[i] if i < len(daily_schedules) else None

        # Weather note for the day
        if daily_weather and i < len(daily_weather):
            high_temp = daily_weather[i]
            weather_snippet = f"Expected high of {high_temp}°C"
        else:
            weather_snippet = "Pleasant mountain climate"

        if day_num == 1:
            title = f"Day 1: Scenic Drive to {dest_name} & Valley Check-in"
            morning_act = f"Early departure from {profile.get('starting_location', 'Delhi')}, scenic drive through foothills"
            afternoon_act = schedule["afternoon"]["activity"] if schedule else "Hotel check-in & leisurely local stroll"
            evening_act = schedule["evening"]["activity"] if schedule else f"Sunset view at {dest_name} viewpoints"
        elif day_num == days:
            title = f"Day {day_num}: Sunrise Exploration & Return Journey"
            morning_act = schedule["morning"]["activity"] if schedule else "Sunrise vantage point & nature walk"
            afternoon_act = "Local handicraft souvenirs & relaxed lunch"
            evening_act = f"Scenic return transfer toward {profile.get('starting_location', 'Delhi')}"
        else:
            title = f"Day {day_num}: Deep Dive Adventure & Hidden Trails"
            morning_act = schedule["morning"]["activity"] if schedule else "Guided ridge trail & waterfall hike"
            afternoon_act = schedule["afternoon"]["activity"] if schedule else "Adventure sports / Monastery immersion"
            evening_act = schedule["evening"]["activity"] if schedule else "Riverside cafe dinner & stargazing"

        day_plan = {
            "day": day_num,
            "title": title,
            "destination": dest_name,
            "activities": [morning_act, afternoon_act, evening_act],
            "schedule": {
                "morning": {
                    "time": "08:00 AM - 12:00 PM",
                    "title": morning_act
                },
                "afternoon": {
                    "time": "01:00 PM - 05:00 PM",
                    "title": afternoon_act
                },
                "evening": {
                    "time": "06:00 PM - 09:00 PM",
                    "title": evening_act
                }
            },
            "recommended_meals": {
                "breakfast": meal_triplet[0],
                "lunch": meal_triplet[1],
                "dinner": meal_triplet[2]
            },
            "weather_note": weather_snippet
        }

        itinerary.append(day_plan)

    return itinerary