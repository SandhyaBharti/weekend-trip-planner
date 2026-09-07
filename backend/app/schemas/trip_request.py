from pydantic import BaseModel
from datetime import date


class TripRequest(BaseModel):
    location: str
    budget: float
    days: int
    people: int
    relationship: str
    interests: list[str]
    max_travel_hours: int
    start_date: date