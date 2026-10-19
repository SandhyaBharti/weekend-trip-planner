import {
  MapPin,
  DollarSign,
  Calendar,
  Users,
  HeartHandshake,
  Clock,
  Sparkles,
  AlertCircle,
  Compass,
  Hotel,
  Car,
  Bus
} from "lucide-react";
import "./TripPlannerForm.css";

function TripPlannerForm({ form, setForm, onSubmit, loading, error }) {
  const interestsList = ["mountains", "peaceful", "trekking", "adventure", "nature"];

  const relationshipOptions = [
    { value: "couple", label: "Couple", emoji: "💑" },
    { value: "friends", label: "Friends", emoji: "👥" },
    { value: "family", label: "Family", emoji: "👨‍👩‍👧" },
    { value: "solo", label: "Solo", emoji: "🎒" }
  ];

  const accommodationTiers = [
    { value: "budget", label: "Budget Homestay", desc: "Cozy rooms & hostels (~₹1,200/night)" },
    { value: "comfortable", label: "Comfortable Resort", desc: "Pine view 3-star cottages (~₹2,600/night)" },
    { value: "luxury", label: "Luxury Heritage", desc: "Premium mountain spa retreat (~₹6,000/night)" }
  ];

  const transportModes = [
    { value: "cab_or_car", label: "Cab / Sedan", icon: Car },
    { value: "self_drive", label: "Self Drive", icon: Compass },
    { value: "bus_train", label: "Volvo AC Bus", icon: Bus }
  ];

  const presetBudgets = [8000, 15000, 22000, 35000];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((x) => x !== interest)
        : [...prev.interests, interest]
    }));
  };

  const adjustCounter = (field, delta, min = 1, max = 20) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.min(max, Math.max(min, Number(prev[field] || 1) + delta))
    }));
  };

  const dailyPerPerson = Math.round(Number(form.budget || 0) / (Math.max(1, form.days) * Math.max(1, form.people)));

  return (
    <div className="planner-card animate-fade-in">
      <div className="planner-header">
        <div className="planner-title-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>AI Multi-Agent Itinerary Engine</span>
        </div>
        <h2>Customize Your Weekend Escape</h2>
        <p>Set your travel parameters to calculate verified destinations, itemized costs, and weather forecasts.</p>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="planner-form">
        {/* Starting Location & Start Date */}
        <div className="form-grid-2">
          <div className="input-group">
            <label htmlFor="input-location">
              <MapPin size={16} aria-hidden="true" /> Starting Hub / Origin
            </label>
            <input
              id="input-location"
              type="text"
              name="location"
              placeholder="e.g. Delhi, Chandigarh, Dehradun"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="input-start-date">
              <Calendar size={16} aria-hidden="true" /> Departure Date
            </label>
            <input
              id="input-start-date"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Budget & Quick Presets */}
        <div className="input-group">
          <div className="label-row">
            <label htmlFor="input-budget">
              <DollarSign size={16} aria-hidden="true" /> Total Trip Budget (₹)
            </label>
            <div className="budget-presets" aria-label="Preset budget options">
              {presetBudgets.map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`preset-chip ${Number(form.budget) === val ? "active" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, budget: val }))}
                  aria-label={`Set budget to ₹${val.toLocaleString()}`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <input
            id="input-budget"
            type="number"
            name="budget"
            placeholder="e.g. 15000"
            value={form.budget}
            onChange={handleChange}
            required
            min="1000"
          />
          <div className="budget-hint">
            <span>Estimated budget available: <strong>₹{dailyPerPerson.toLocaleString()}</strong> per person / day</span>
          </div>
        </div>

        {/* Travel Style Selector */}
        <div className="input-group">
          <label>
            <HeartHandshake size={16} aria-hidden="true" /> Traveling As
          </label>
          <div className="relationship-grid" role="radiogroup" aria-label="Travel group type">
            {relationshipOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`relation-card ${form.relationship === opt.value ? "selected" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, relationship: opt.value }))}
                aria-checked={form.relationship === opt.value}
                role="radio"
              >
                <span className="relation-emoji" aria-hidden="true">{opt.emoji}</span>
                <span className="relation-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration, Travelers & Travel Radius */}
        <div className="form-grid-3">
          <div className="input-group">
            <label>
              <Calendar size={16} aria-hidden="true" /> Duration
            </label>
            <div className="counter-box">
              <button type="button" onClick={() => adjustCounter("days", -1, 1, 14)} aria-label="Decrease days">-</button>
              <span>{form.days} Days</span>
              <button type="button" onClick={() => adjustCounter("days", 1, 1, 14)} aria-label="Increase days">+</button>
            </div>
          </div>

          <div className="input-group">
            <label>
              <Users size={16} aria-hidden="true" /> Travelers
            </label>
            <div className="counter-box">
              <button type="button" onClick={() => adjustCounter("people", -1, 1, 20)} aria-label="Decrease travelers">-</button>
              <span>{form.people} {form.people === 1 ? "Person" : "People"}</span>
              <button type="button" onClick={() => adjustCounter("people", 1, 1, 20)} aria-label="Increase travelers">+</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="input-travel-hours">
              <Clock size={16} aria-hidden="true" /> Max Drive Radius
            </label>
            <div className="slider-wrapper">
              <input
                id="input-travel-hours"
                type="range"
                name="max_travel_hours"
                min="2"
                max="12"
                value={form.max_travel_hours}
                onChange={handleChange}
                aria-valuemin={2}
                aria-valuemax={12}
                aria-valuenow={form.max_travel_hours}
              />
              <span className="slider-value">{form.max_travel_hours} Hours</span>
            </div>
          </div>
        </div>

        {/* Accommodation Tier Preference */}
        <div className="input-group">
          <label>
            <Hotel size={16} aria-hidden="true" /> Accommodation Preference
          </label>
          <div className="tier-selector-grid">
            {accommodationTiers.map((tier) => {
              const isSelected = (form.accommodation_tier || "comfortable") === tier.value;
              return (
                <button
                  type="button"
                  key={tier.value}
                  className={`tier-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, accommodation_tier: tier.value }))}
                >
                  <strong>{tier.label}</strong>
                  <span>{tier.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Transport Mode */}
        <div className="input-group">
          <label>
            <Car size={16} aria-hidden="true" /> Preferred Transit Mode
          </label>
          <div className="transport-mode-grid">
            {transportModes.map((t) => {
              const IconComp = t.icon;
              const isSelected = (form.transport_mode || "cab_or_car") === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  className={`transport-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, transport_mode: t.value }))}
                >
                  <IconComp size={16} aria-hidden="true" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Pills */}
        <div className="input-group">
          <label>
            <Compass size={16} aria-hidden="true" /> Select Preferred Weekend Vibe
          </label>
          <div className="interests-grid" aria-label="Select activities">
            {interestsList.map((item) => {
              const isSelected = form.interests.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  className={`interest-pill ${isSelected ? "selected" : ""}`}
                  onClick={() => handleInterestToggle(item)}
                  aria-pressed={isSelected}
                >
                  <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button className="btn-submit-planner" type="submit" disabled={loading}>
          {loading ? (
            <div className="loading-spinner-row">
              <div className="spinner" />
              <span>Analyzing Feasibility, Transit & Weather Agents...</span>
            </div>
          ) : (
            <>
              <Sparkles size={18} aria-hidden="true" />
              <span>Calculate Feasible Trip Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default TripPlannerForm;
