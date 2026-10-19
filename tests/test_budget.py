import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.utils.cost import calculate_cost


class TestCostCalculation(unittest.TestCase):
    def test_within_budget(self):
        destination = {"travel_hours": 4, "activities": ["mountains", "peaceful"]}
        profile = {"people": 2, "days": 2, "budget": 15000}
        cost = calculate_cost(destination, profile)
        self.assertEqual(cost["status"], "within_budget")
        self.assertTrue(cost["total"] <= profile["budget"])
        self.assertEqual(cost["difference"], profile["budget"] - cost["total"])

    def test_over_budget(self):
        destination = {"travel_hours": 10, "activities": ["mountains", "peaceful", "trekking", "adventure"]}
        profile = {"people": 4, "days": 5, "budget": 5000}
        cost = calculate_cost(destination, profile)
        self.assertEqual(cost["status"], "over_budget")
        self.assertTrue(cost["total"] > profile["budget"])
        self.assertEqual(cost["difference"], cost["total"] - profile["budget"])


if __name__ == "__main__":
    unittest.main()
