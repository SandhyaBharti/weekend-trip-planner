from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class TripRequest(BaseModel):
    location: str
    budget: float
    days: int
    people: int
    relationship: str = "couple"
    interests: List[str] = []
    max_travel_hours: int = 8
    start_date: date
    accommodation_tier: Optional[str] = "comfortable"
    transport_mode: Optional[str] = "cab_or_car"