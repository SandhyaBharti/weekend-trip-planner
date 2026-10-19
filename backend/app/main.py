from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.trip_request import TripRequest
from app.agents.requirement_agent import analyze_requirements
from app.agents.destination_agent import find_destinations
from app.agents.ranking_agent import rank_destinations
from app.agents.weather_agent import analyze_weather
from app.agents.cost_agent import analyze_cost
from app.agents.trip_manager import create_itinerary


app = FastAPI(title="Weekend Trip Planner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Weekend Trip Planner API is running!"
    }


@app.post("/plan-trip")
def plan_trip(trip: TripRequest):

    profile = analyze_requirements(trip)

    if "error" in profile:
        return profile

    destinations = find_destinations(profile)

    if not destinations:
        return {
            "message": "No destinations found matching your requirements",
            "profile": profile,
            "destinations": []
        }

    destinations = rank_destinations(destinations, profile)

    destinations = analyze_weather(destinations, profile)

    destinations = analyze_cost(destinations, profile)

    itinerary = create_itinerary(destinations, profile)

    return {
        "message": "Trip recommendations ready",
        "profile": profile,
        "destinations": destinations,
        "itinerary": itinerary
    }