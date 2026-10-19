import math


def calculate_accommodation_details(destination, profile):
    """
    Computes required room count, nights, tier rates, and recommended property
    based on traveler relationship and preferences.
    """
    people = profile.get("people", 2)
    days = profile.get("days", 2)
    relationship = profile.get("relationship", "couple").lower()
    nights = max(1, days - 1)

    # Room calculation based on group composition
    if relationship == "couple":
        rooms = max(1, math.ceil(people / 2))
        room_type = "Private Double Room" if people == 2 else f"{rooms} Double Rooms"
    elif relationship == "family":
        rooms = max(1, math.ceil(people / 3))
        room_type = "Family Suite" if people <= 4 else f"{rooms} Family Connecting Rooms"
    elif relationship == "solo":
        rooms = 1
        room_type = "Single / Private Boutique Room"
    else:  # friends
        rooms = max(1, math.ceil(people / 2))
        room_type = f"{rooms} Twin-Sharing Room(s)"

    # Base rate per room per night
    rates = {
        "budget": 1200,
        "comfortable": 2600,
        "luxury": 6000
    }

    tier = profile.get("accommodation_tier", "comfortable")
    if tier not in rates:
        tier = "comfortable"

    # Destination-specific stay name
    stay_options = destination.get("stay_options", {})
    recommended_property = stay_options.get(tier, f"{destination.get('name')} Mountain Retreat")

    total_cost = rooms * nights * rates[tier]

    return {
        "tier": tier,
        "rooms": rooms,
        "nights": nights,
        "room_type": room_type,
        "rate_per_room_night": rates[tier],
        "total_cost": total_cost,
        "recommended_property": recommended_property
    }
