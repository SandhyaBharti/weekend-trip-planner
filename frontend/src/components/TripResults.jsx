import { useState } from "react";
import { Sparkles, MapPin, Star, Clock, CloudSun, AlertTriangle, Calendar, BookmarkCheck, Check, Share2, ArrowRight } from "lucide-react";
import "./TripResults.css";

const DESTINATION_IMAGES = {
  "Dharamshala": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80",
  "Dalhousie": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",
  "Kasol": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
};

function TripResults({ result, onSaveTrip, savedTripIds = [] }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAlreadySaved = result.id ? savedTripIds.includes(result.id) : false;

  return (
    <div className="results-container animate-fade-in">
      
      {/* Banner */}
      <div className="results-header-banner">
        <div className="banner-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>Trip Plan Ready</span>
        </div>
        <h2>{result.message}</h2>
        <p>Based on your budget, timeframe, and interests, here are your recommended weekend getaways.</p>

        <div className="results-actions">
          <button
            className={`btn-save-trip ${isAlreadySaved ? "saved" : ""}`}
            onClick={() => onSaveTrip(result)}
            aria-label={isAlreadySaved ? "Trip saved to My Trips" : "Save trip to My Trips"}
          >
            <BookmarkCheck size={17} aria-hidden="true" />
            <span>{isAlreadySaved ? "Saved to My Trips" : "Save Trip"}</span>
          </button>

          <button className="btn-share-trip" onClick={handleShare} aria-label="Share trip itinerary link">
            {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
            <span>{copied ? "Link Copied!" : "Share Itinerary"}</span>
          </button>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="results-section">
        <h3 className="section-title">📍 Top Recommended Matches</h3>

        <div className="recommendations-grid">
          {result.destinations?.map((d, index) => {
            const imgUrl = DESTINATION_IMAGES[d.name] || DESTINATION_IMAGES["Dharamshala"];
            const isWithinBudget = d.cost?.status === "within_budget";

            return (
              <div key={d.name} className="dest-recommendation-card">
                
                {/* Image Header */}
                <div className="dest-img-box">
                  <img src={imgUrl} alt={`Landscape view of ${d.name}`} loading="lazy" />
                  <div className="rank-badge">#{index + 1} Best Match</div>
                  <div className="rating-badge">
                    <Star size={13} fill="#D97706" color="#D97706" aria-hidden="true" />
                    <span>{d.rating}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="dest-card-body">
                  <div className="dest-title-row">
                    <div>
                      <h4>{d.name}</h4>
                      <span className="dest-state"><MapPin size={13} aria-hidden="true" /> {d.state}</span>
                    </div>
                    <span className="travel-hrs-badge">
                      <Clock size={13} aria-hidden="true" /> {d.travel_hours} hrs travel
                    </span>
                  </div>

                  {/* Weather Warning */}
                  {d.weather_warning && (
                    <div className={`weather-box ${d.weather_warning.includes("Rain") ? "rain-warning" : "clear-weather"}`}>
                      {d.weather_warning.includes("Rain") ? <AlertTriangle size={15} aria-hidden="true" /> : <CloudSun size={15} aria-hidden="true" />}
                      <span>{d.weather_warning}</span>
                    </div>
                  )}

                  {/* Cost Breakdown */}
                  {d.cost && (
                    <div className="cost-breakdown-box">
                      <div className="cost-header">
                        <div>
                          <span className="cost-label">Est. Total Cost</span>
                          <h4 className="total-cost-val">₹{d.cost.total?.toLocaleString()}</h4>
                        </div>
                        <span className={`budget-status-pill ${isWithinBudget ? "status-good" : "status-over"}`}>
                          {isWithinBudget ? `✅ ₹${d.cost.difference?.toLocaleString()} within budget` : `⚠️ ₹${d.cost.difference?.toLocaleString()} over budget`}
                        </span>
                      </div>

                      <div className="cost-grid-items">
                        <div className="cost-item">
                          <span>🚗 Transport</span>
                          <strong>₹{d.cost.transport?.toLocaleString()}</strong>
                        </div>
                        <div className="cost-item">
                          <span>🏨 Stay/Hotel</span>
                          <strong>₹{d.cost.hotel?.toLocaleString()}</strong>
                        </div>
                        <div className="cost-item">
                          <span>🍽️ Food</span>
                          <strong>₹{d.cost.food?.toLocaleString()}</strong>
                        </div>
                        <div className="cost-item">
                          <span>🎯 Activities</span>
                          <strong>₹{d.cost.activities?.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activities List */}
                  <div className="activities-row">
                    <span className="act-label">Activities:</span>
                    {d.activities?.map((act) => (
                      <span key={act} className="act-tag">#{act}</span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Itinerary Timeline */}
      {result.itinerary && result.itinerary.length > 0 && (
        <div className="results-section itinerary-section">
          <h3 className="section-title"><Calendar size={18} aria-hidden="true" /> Customized Day-by-Day Itinerary</h3>

          <div className="timeline-wrapper">
            {result.itinerary.map((day) => (
              <div key={day.day} className="timeline-day-card">
                <div className="day-number-badge">Day {day.day}</div>
                <div className="day-info-box">
                  <h4>📍 Location: {day.destination}</h4>
                  <div className="day-activities-list">
                    {day.activities?.map((act, i) => (
                      <div key={i} className="day-act-chip">
                        <ArrowRight size={14} className="act-arrow" aria-hidden="true" />
                        <span>{act.charAt(0).toUpperCase() + act.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default TripResults;
