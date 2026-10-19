from datetime import date, timedelta
from app.services.weather_service import get_weather


def analyze_weather(destinations, profile):

    start = date.fromisoformat(profile["start_date"])
    end = start + timedelta(days=profile["days"] - 1)

    for d in destinations:

        weather = get_weather(
            d["latitude"],
            d["longitude"],
            start.isoformat(),
            end.isoformat()
        )

        d["weather"] = weather["daily"]

        rain = weather["daily"]["precipitation_sum"]

        if any(value > 0 for value in rain):
            d["weather_warning"] = "Rain is possible during your trip."
        else:
            d["weather_warning"] = "No rain is currently forecast."

    return destinations