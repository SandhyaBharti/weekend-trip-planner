import unittest
import sys
from datetime import date
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.agents.transport_agent import calculate_transport_details
from app.agents.accommodation_agent import calculate_accommodation_details
from app.agents.activity_agent import plan_activities_for_destination
from app.agents.weather_agent import analyze_weather
from app.schemas.trip_request import TripRequest
from app.main import plan_trip


class TestSpecializedAgents(unittest.TestCase):
    def test_transport_agent_dynamic_hub(self):
        destination = {"name": "Manali", "state": "Himachal Pradesh", "travel_hours": 7}
        profile_delhi = {"starting_location": "Delhi", "people": 2, "days": 2, "max_travel_hours": 8}
        profile_chandigarh = {"starting_location": "Chandigarh", "people": 2, "days": 2, "max_travel_hours": 8}

        t_delhi = calculate_transport_details(destination, profile_delhi)
        t_chd = calculate_transport_details(destination, profile_chandigarh)

        # Chandigarh is closer to Himachal Pradesh than Delhi
        self.assertLess(t_chd["adjusted_hours"], t_delhi["adjusted_hours"])
        self.assertIn("cost", t_delhi)
        self.assertIn("feasibility", t_delhi)

    def test_accommodation_agent_room_sharing(self):
        dest = {
            "name": "Dharamshala",
            "stay_options": {
                "budget": "Hostel",
                "comfortable": "Pine Retreat",
                "luxury": "Luxury Resort"
            }
        }
        # A couple sharing 1 room
        profile_couple = {"people": 2, "days": 3, "relationship": "couple", "accommodation_tier": "comfortable"}
        res_couple = calculate_accommodation_details(dest, profile_couple)
        self.assertEqual(res_couple["rooms"], 1)
        self.assertEqual(res_couple["nights"], 2)
        self.assertEqual(res_couple["recommended_property"], "Pine Retreat")

        # 4 friends needing 2 twin-sharing rooms
        profile_friends = {"people": 4, "days": 3, "relationship": "friends", "accommodation_tier": "budget"}
        res_friends = calculate_accommodation_details(dest, profile_friends)
        self.assertEqual(res_friends["rooms"], 2)

    def test_activity_agent_scheduling(self):
        dest = {
            "name": "Rishikesh",
            "highlights": ["River Rafting", "Ganga Aarti", "Beatles Ashram"],
            "activities": ["adventure", "peaceful"]
        }
        profile = {"days": 2, "people": 2, "interests": ["adventure"]}
        acts = plan_activities_for_destination(dest, profile)
        self.assertEqual(len(acts["daily_schedules"]), 2)
        day1 = acts["daily_schedules"][0]
        self.assertIn("morning", day1)
        self.assertIn("afternoon", day1)
        self.assertIn("evening", day1)

    def test_weather_agent_scoring(self):
        destinations = [
            {"name": "Dharamshala", "latitude": 32.219, "longitude": 76.323}
        ]
        profile = {
            "start_date": "2026-11-01",
            "days": 2
        }
        res = analyze_weather(destinations, profile)
        self.assertIn("weather_score", res[0])
        self.assertIn("weather_warning", res[0])
        self.assertIn("weather_summary", res[0])
        self.assertGreaterEqual(res[0]["weather_score"], 0.2)
        self.assertLessEqual(res[0]["weather_score"], 1.0)

    def test_full_plan_trip_flow(self):
        req = TripRequest(
            location="Delhi",
            budget=16000,
            days=2,
            people=2,
            relationship="couple",
            interests=["mountains", "trekking"],
            max_travel_hours=7,
            start_date=date(2026, 11, 5)
        )
        response = plan_trip(req)
        self.assertIn("destinations", response)
        self.assertIn("itinerary", response)
        self.assertIn("feasibility_report", response)
        self.assertIn("packing_essentials", response)
        self.assertIn("verdict", response["feasibility_report"])
        self.assertGreater(len(response["destinations"]), 0)


if __name__ == "__main__":
    unittest.main()
