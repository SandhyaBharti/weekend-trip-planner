from datetime import date, timedelta
from app.services.weather_service import get_weather


def analyze_weather(destinations, profile):
    """
    Fetches daily meteorological data, computes a normalized weather suitability score,
    and produces actionable weather advisories & clothing suggestions.
    """
    try:
        start = date.fromisoformat(profile["start_date"])
    except Exception:
        start = date.today()

    end = start + timedelta(days=max(1, profile.get("days", 2)) - 1)

    for d in destinations:
        weather = get_weather(
            d["latitude"],
            d["longitude"],
            start.isoformat(),
            end.isoformat()
        )

        daily = weather.get("daily", {})
        d["weather"] = daily

        rain_values = daily.get("precipitation_sum", [0.0])
        max_temps = daily.get("temperature_2m_max", [20.0])
        min_temps = daily.get("temperature_2m_min", [10.0])
        wind_speeds = daily.get("wind_speed_10m_max", [8.0])

        total_rain = sum(v for v in rain_values if isinstance(v, (int, float)))
        max_rain = max(rain_values) if rain_values else 0.0
        avg_high = round(sum(max_temps) / max(1, len(max_temps)), 1)
        avg_low = round(sum(min_temps) / max(1, len(min_temps)), 1)
        max_wind = max(wind_speeds) if wind_speeds else 0.0

        # Calculate Weather Score (0.0 to 1.0)
        # Optimal temperature is around 18-24°C
        temp_penalty = abs(avg_high - 21) * 0.02
        rain_penalty = min(0.5, total_rain * 0.06)
        wind_penalty = 0.1 if max_wind > 20 else 0.0

        weather_score = max(0.2, min(1.0, 1.0 - temp_penalty - rain_penalty - wind_penalty))
        d["weather_score"] = round(weather_score, 3)

        # Weather Condition & Warning
        if max_rain > 5.0:
            warning = f"Moderate to heavy rain forecast ({round(max_rain, 1)}mm). Pack waterproof gear."
            condition = "Rain Expected"
            feasibility = "MODERATE"
        elif max_rain > 0.4:
            warning = f"Scattered light showers possible ({round(max_rain, 1)}mm)."
            condition = "Passing Showers"
            feasibility = "GOOD"
        else:
            warning = "Clear skies & pleasant weather forecast."
            condition = "Clear & Pleasant"
            feasibility = "EXCELLENT"

        d["weather_warning"] = warning
        d["weather_summary"] = {
            "condition": condition,
            "avg_high": avg_high,
            "avg_low": avg_low,
            "total_rain_mm": round(total_rain, 1),
            "feasibility": feasibility,
            "clothing_tip": (
                "Thermal base layer & warm fleece recommended (chilly night)."
                if avg_low < 8
                else "Light woolens for morning/evening and comfortable walking shoes."
            )
        }

    return destinations