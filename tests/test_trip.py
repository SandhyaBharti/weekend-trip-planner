import unittest
import sys
from datetime import date
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.schemas.trip_request import TripRequest
from app.agents.requirement_agent import analyze_requirements
from app.agents.trip_manager import create_itinerary


class TestTripPipeline(unittest.TestCase):
    def test_requirement_validation_success(self):
        req = TripRequest(
            location="Delhi",
            budget=10000,
            days=2,
            people=2,
            relationship="friends",
            interests=["nature"],
            max_travel_hours=5,
            start_date=date(2026, 11, 1)
        )
        profile = analyze_requirements(req)
        self.assertNotIn("error", profile)
        self.assertEqual(profile["starting_location"], "Delhi")
        self.assertEqual(profile["budget"], 10000)

    def test_requirement_validation_invalid_budget(self):
        req = TripRequest(
            location="Delhi",
            budget=0,
            days=2,
            people=2,
            relationship="solo",
            interests=["trekking"],
            max_travel_hours=5,
            start_date=date(2026, 11, 1)
        )
        profile = analyze_requirements(req)
        self.assertIn("error", profile)

    def test_create_itinerary(self):
        destinations = [
            {"name": "Dharamshala", "activities": ["mountains", "peaceful", "trekking"]},
            {"name": "Kasol", "activities": ["mountains", "nature"]}
        ]
        profile = {"days": 2}
        itinerary = create_itinerary(destinations, profile)
        self.assertEqual(len(itinerary), 2)
        self.assertEqual(itinerary[0]["day"], 1)
        self.assertEqual(itinerary[0]["destination"], "Dharamshala")
        self.assertEqual(itinerary[1]["day"], 2)


if __name__ == "__main__":
    unittest.main()
