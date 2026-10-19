from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.trip_request import TripRequest
from app.agents.requirement_agent import analyze_requirements
from app.agents.destination_agent import find_destinations
from app.agents.ranking_agent import rank_destinations
from app.agents.weather_agent import analyze_weather
from app.agents.cost_agent import analyze_cost
from app.agents.trip_manager import create_itinerary


app = FastAPI(
    title="WeekendEscapes AI Trip Planner",
    description="Multi-agent AI weekend getaway recommendation & itinerary planning API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "WeekendEscapes Multi-Agent AI API",
        "version": "2.0.0"
    }


@app.post("/plan-trip")
def plan_trip(trip: TripRequest):
    # 1. Requirement & Validation Agent
    profile = analyze_requirements(trip)
    if "error" in profile:
        return {"error": profile["error"], "status": "validation_failed"}

    # 2. Destination Candidate Retrieval Agent
    destinations = find_destinations(profile)
    if not destinations:
        return {
            "message": "No destinations found within your constraints. Try increasing max travel hours or selecting more interests.",
            "profile": profile,
            "destinations": [],
            "itinerary": [],
            "feasibility_report": {
                "verdict": "NOT_FEASIBLE",
                "summary": "Constraints are too restrictive to reach hill stations from your location."
            }
        }

    # 3. Weather Analysis Agent (Open-Meteo)
    destinations = analyze_weather(destinations, profile)

    # 4. Multi-modal Cost & Budget Agent
    destinations = analyze_cost(destinations, profile)

    # 5. Multi-Criteria Ranking Agent (MCDA)
    destinations = rank_destinations(destinations, profile)

    # 6. Trip Itinerary Manager Agent
    itinerary = create_itinerary(destinations, profile)

    # 7. Global Feasibility Synthesis
    top_match = destinations[0] if destinations else {}
    top_cost = top_match.get("cost", {})
    top_weather = top_match.get("weather_summary", {})
    sub_scores = top_match.get("sub_scores", {})

    is_budget_ok = top_cost.get("status") == "within_budget"
    is_weather_ok = "Rain" not in top_match.get("weather_warning", "")

    if is_budget_ok and is_weather_ok:
        verdict = "FEASIBLE"
        verdict_summary = "All checks passed! Great balance of travel duration, budget headroom, and clear weather."
    elif not is_budget_ok:
        verdict = "BUDGET_ATTENTION"
        verdict_summary = f"Estimated trip cost exceeds total budget by ₹{int(top_cost.get('difference', 0)):,}. Review stay or transit options."
    else:
        verdict = "WEATHER_ADVISORY"
        verdict_summary = "Destination is feasible and within budget, but light or passing rain is predicted. Pack waterproofs."

    feasibility_report = {
        "verdict": verdict,
        "summary": verdict_summary,
        "composite_score": top_match.get("score", 0.8),
        "scores": {
            "budget_feasibility_pct": int(sub_scores.get("budget", 0.8) * 100),
            "weather_suitability_pct": int(sub_scores.get("weather", 0.85) * 100),
            "travel_efficiency_pct": int(sub_scores.get("travel", 0.75) * 100),
            "interest_match_pct": int(sub_scores.get("interest", 0.9) * 100)
        },
        "key_tips": [
            f"Departure: Start early from {profile['starting_location']} (by 06:00 AM) to beat weekend highway rush.",
            f"Stay: Book {top_cost.get('hotel_details', {}).get('recommended_property', 'your cottage')} in advance for weekend peak rates.",
            f"Connectivity: Carry some cash as mountain UPI networks can occasionally have spotty coverage."
        ]
    }

    packing_essentials = [
        "Light fleece / warm jacket for cool mountain mornings & evenings",
        "Comfortable grip walking or trekking shoes",
        "Waterproof windcheater / compact umbrella",
        "Portable power bank (10,000+ mAh) & car charging cable",
        "Government ID proofs (Aadhaar / Voter ID) for hotel check-ins",
        "Personal first-aid kit with motion sickness tablets for hill curves"
    ]

    return {
        "message": f"Optimal weekend trip recommendations ready for {top_match.get('name')}",
        "profile": profile,
        "destinations": destinations,
        "itinerary": itinerary,
        "feasibility_report": feasibility_report,
        "packing_essentials": packing_essentials
    }