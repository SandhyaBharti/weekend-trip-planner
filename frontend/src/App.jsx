import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    location: "",
    budget: "",
    days: 2,
    people: 2,
    relationship: "couple",
    interests: [],
    max_travel_hours: 5,
    start_date: ""
  });

  const interests = [
    "mountains",
    "peaceful",
    "trekking",
    "adventure",
    "nature"
  ];

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((x) => x !== interest)
        : [...prev.interests, interest]
    }));
  };

  const planTrip = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          days: Number(form.days),
          people: Number(form.people),
          max_travel_hours: Number(form.max_travel_hours)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        message: "Could not connect to backend. Make sure FastAPI is running."
      });
    }

    setLoading(false);
  };

  return (
    <div className="app">

      <header>
        <h1>🌄 Weekend Trip Planner</h1>
        <p>Find the best trip based on your preferences</p>
      </header>

      <form onSubmit={planTrip} className="form">

        <input
          name="location"
          placeholder="Starting location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="budget"
          type="number"
          placeholder="Budget (₹)"
          value={form.budget}
          onChange={handleChange}
          required
        />

        <div className="row">
          <input
            name="days"
            type="number"
            min="1"
            placeholder="Days"
            value={form.days}
            onChange={handleChange}
          />

          <input
            name="people"
            type="number"
            min="1"
            placeholder="People"
            value={form.people}
            onChange={handleChange}
          />
        </div>

        <select
          name="relationship"
          value={form.relationship}
          onChange={handleChange}
        >
          <option value="couple">Couple</option>
          <option value="friends">Friends</option>
          <option value="family">Family</option>
          <option value="solo">Solo</option>
        </select>

        <input
          name="max_travel_hours"
          type="number"
          min="1"
          placeholder="Maximum travel hours"
          value={form.max_travel_hours}
          onChange={handleChange}
        />

        <label>Start Date</label>

        <input
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        <h3>What are you interested in?</h3>

        <div className="interests">
          {interests.map((interest) => (
            <button
              type="button"
              key={interest}
              className={
                form.interests.includes(interest) ? "selected" : ""
              }
              onClick={() => handleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>

        <button className="plan-btn" type="submit">
          {loading ? "Planning..." : "🚀 Plan My Trip"}
        </button>

      </form>

      {result && (
        <div className="results">

          <h2>{result.message}</h2>

          {result.destinations?.map((d, index) => (
            <div className="card" key={d.name}>

              <h2>
                {index + 1}. {d.name}
              </h2>

              <p>📍 {d.state}</p>
              <p>⭐ Rating: {d.rating}</p>
              <p>🚗 Travel: {d.travel_hours} hours</p>

              <p>
                🎯 Match: {d.interest_match} / {form.interests.length}
              </p>

              <p>
                🌧️ {d.weather_warning}
              </p>

              {d.cost && (
                <div className="cost">
                  <h3>💰 Estimated Cost: ₹{d.cost.total}</h3>

                  <p>Transport: ₹{d.cost.transport}</p>
                  <p>Hotel: ₹{d.cost.hotel}</p>
                  <p>Food: ₹{d.cost.food}</p>
                  <p>Activities: ₹{d.cost.activities}</p>

                  {d.cost.status === "within_budget" ? (
                    <p className="good">
                      ✅ ₹{d.cost.difference} remaining
                    </p>
                  ) : (
                    <p className="warning">
                      ⚠️ Over budget by ₹{d.cost.difference}
                    </p>
                  )}
                </div>
              )}

              <p>
                🏔️ Activities: {d.activities.join(", ")}
              </p>

            </div>
          ))}

          {result.itinerary && (
            <div className="itinerary">

              <h2>🗓️ Your Itinerary</h2>

              {result.itinerary.map((day) => (
                <div className="day" key={day.day}>
                  <h3>Day {day.day}</h3>
                  <p>📍 {day.destination}</p>
                  <p>
                    {day.activities.join(" • ")}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;