import requests


def get_weather(latitude, longitude, start_date, end_date):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date,
        "end_date": end_date,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        "timezone": "auto"
    }

    response = requests.get(url, params=params)

    response.raise_for_status()

    return response.json()