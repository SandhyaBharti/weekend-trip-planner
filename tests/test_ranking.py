import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.agents.ranking_agent import rank_destinations


class TestRankingAgent(unittest.TestCase):
    def test_ranking_order(self):
        profile = {
            "interests": ["mountains", "trekking"],
            "max_travel_hours": 8
        }
        destinations = [
            {
                "name": "DestA",
                "interest_match": 1,
                "rating": 4.0,
                "travel_hours": 6
            },
            {
                "name": "DestB",
                "interest_match": 2,
                "rating": 4.8,
                "travel_hours": 3
            }
        ]
        ranked = rank_destinations(destinations, profile)
        self.assertEqual(len(ranked), 2)
        # DestB has higher interest match, rating, and lower travel hours
        self.assertEqual(ranked[0]["name"], "DestB")
        self.assertGreater(ranked[0]["score"], ranked[1]["score"])


if __name__ == "__main__":
    unittest.main()
