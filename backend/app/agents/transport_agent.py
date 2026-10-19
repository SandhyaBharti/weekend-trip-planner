import math


def calculate_transport_details(destination, profile):
    """
    Computes transport options, costs, travel duration adjustments,
    and road travel feasibility indicators.
    """
    origin = profile.get("starting_location", "Delhi").strip().lower()
    base_hours = destination.get("travel_hours", 6)
    state = destination.get("state", "").lower()
    people = profile.get("people", 2)
    days = profile.get("days", 2)

    # Dynamic adjustments based on departure hub
    adjusted_hours = base_hours
    if "chandigarh" in origin:
        if "himachal" in state:
            adjusted_hours = max(2, base_hours - 2)
        elif "uttarakhand" in state:
            adjusted_hours = max(3, base_hours - 1)
    elif "dehradun" in origin:
        if "uttarakhand" in state:
            adjusted_hours = max(1, base_hours - 4)
        elif "himachal" in state:
            adjusted_hours = max(4, base_hours - 1)
    elif "delhi" in origin or "noida" in origin or "gurugram" in origin:
        adjusted_hours = base_hours

    # Estimated one-way distance (approx 50-60 km/h average mountain speed)
    distance_km = int(adjusted_hours * 52)
    round_trip_km = distance_km * 2

    # Transport mode costs
    # 1. Self Drive / Personal Car (Fuel + Tolls)
    fuel_cost = int(round_trip_km * 7.5) + (400 if round_trip_km > 200 else 0)
    # 2. Private Taxi / Cab (Commercial rate ~14/km + driver allowance)
    cab_cost = int(round_trip_km * 13) + (days * 500)
    # 3. Luxury AC Volvo Bus
    bus_ticket = min(1500, max(650, int(distance_km * 2.2)))
    bus_cost = int(bus_ticket * 2 * people)

    # Selected transport cost based on profile preference or smart recommendation
    pref_mode = profile.get("transport_mode", "cab_or_car")
    if pref_mode == "self_drive":
        selected_cost = fuel_cost
        mode_label = "Personal Car (Fuel + Tolls)"
    elif pref_mode == "bus_train":
        selected_cost = bus_cost
        mode_label = f"AC Volvo Bus ({people} Pax)"
    else:
        # For solo traveler, bus is much cheaper; for group >= 3, cab or car is economical
        if people <= 1:
            selected_cost = bus_cost
            mode_label = "AC Volvo / Express Bus"
        elif people >= 4:
            selected_cost = cab_cost
            mode_label = "Private SUV / Cab"
        else:
            selected_cost = int((fuel_cost + cab_cost) / 2)
            mode_label = "Sedan / Cab or Self-Drive"

    # Travel Time Feasibility Analysis
    total_travel_hours = adjusted_hours * 2
    available_waking_hours = days * 14
    travel_percentage = round((total_travel_hours / available_waking_hours) * 100, 1)

    feasibility_status = "feasible"
    travel_warnings = []

    if adjusted_hours > profile.get("max_travel_hours", 10):
        feasibility_status = "exceeds_travel_limit"
        travel_warnings.append(f"One-way travel ({adjusted_hours}h) exceeds your requested maximum ({profile['max_travel_hours']}h).")

    if days <= 2 and adjusted_hours >= 8:
        feasibility_status = "high_fatigue"
        travel_warnings.append(f"Spending {total_travel_hours}h traveling on a {days}-day trip leaves minimal relaxation time.")
    elif travel_percentage > 45:
        travel_warnings.append(f"Road travel consumes {travel_percentage}% of total trip daylight hours.")

    return {
        "adjusted_hours": adjusted_hours,
        "one_way_distance_km": distance_km,
        "round_trip_km": round_trip_km,
        "cost": selected_cost,
        "mode_label": mode_label,
        "options": {
            "self_drive": fuel_cost,
            "private_cab": cab_cost,
            "volvo_bus": bus_cost
        },
        "feasibility": {
            "status": feasibility_status,
            "travel_percentage": travel_percentage,
            "warnings": travel_warnings
        }
    }
