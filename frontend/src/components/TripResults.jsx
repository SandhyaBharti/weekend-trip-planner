import { useState } from "react";
import {
  Sparkles,
  MapPin,
  Star,
  Clock,
  CloudSun,
  AlertTriangle,
  Calendar,
  BookmarkCheck,
  Check,
  Share2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Utensils,
  Hotel,
  Car,
  Compass,
  Download,
  CheckSquare,
  Square,
  Info
} from "lucide-react";
import "./TripResults.css";

const DESTINATION_IMAGES = {
  "Dharamshala": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80",
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80",
  "Dalhousie": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80",
  "Kasol": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80",
  "Shimla": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80",
  "Mussoorie": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80"
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80";

function TripResults({ result, onSaveTrip, savedTripIds = [] }) {
  const [copied, setCopied] = useState(false);
  const [packedItems, setPackedItems] = useState({});

  if (!result) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const togglePacked = (index) => {
    setPackedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isAlreadySaved = result.id ? savedTripIds.includes(result.id) : false;
  const feasibility = result.feasibility_report || {};
  const scores = feasibility.scores || {};
  const destinations = result.destinations || [];

  return (
    <div className="results-container animate-fade-in">
      {/* ── 1. HEADER BANNER ── */}
      <header className="results-header-banner">
        <div className="banner-badge">
          <Sparkles size={14} aria-hidden="true" />
          <span>AI Multi-Agent Itinerary</span>
        </div>
        <h2>{result.message}</h2>
        <p className="banner-subtitle">
          Engineered multi-criteria recommendations matching your budget, departure hub, group size, and live weather.
        </p>

        <div className="results-actions">
          <button
            className={`btn-save-trip ${isAlreadySaved ? "saved" : ""}`}
            onClick={() => onSaveTrip(result)}
            aria-label={isAlreadySaved ? "Trip saved to My Trips" : "Save trip to My Trips"}
          >
            <BookmarkCheck size={17} aria-hidden="true" />
            <span>{isAlreadySaved ? "Saved to My Trips" : "Save Trip"}</span>
          </button>

          <button className="btn-action-outline" onClick={handleShare} aria-label="Share trip link">
            {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>

          <button className="btn-action-outline" onClick={handlePrint} aria-label="Print or Export trip summary">
            <Download size={16} aria-hidden="true" />
            <span>Export / Print</span>
          </button>
        </div>
      </header>

      {/* ── 2. GLOBAL FEASIBILITY REPORT CARD ── */}
      {feasibility.verdict && (
        <section className="feasibility-card animate-fade-in" aria-label="Trip Feasibility Analysis">
          <div className="feasibility-header">
            <div className="feasibility-title-wrap">
              <ShieldCheck size={22} className="feasibility-icon" aria-hidden="true" />
              <div>
                <h3>Trip Feasibility & Verification Report</h3>
                <p>{feasibility.summary}</p>
              </div>
            </div>
            <span className={`feasibility-verdict-pill verdict-${feasibility.verdict.toLowerCase()}`}>
              {feasibility.verdict.replace("_", " ")}
            </span>
          </div>

          {/* Feasibility Metric Gauges */}
          <div className="feasibility-gauges-grid">
            <div className="gauge-item">
              <div className="gauge-meta">
                <span>Budget Feasibility</span>
                <strong>{scores.budget_feasibility_pct || 85}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-budget"
                  style={{ width: `${scores.budget_feasibility_pct || 85}%` }}
                ></div>
              </div>
            </div>

            <div className="gauge-item">
              <div className="gauge-meta">
                <span>Weather Safety</span>
                <strong>{scores.weather_suitability_pct || 90}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-weather"
                  style={{ width: `${scores.weather_suitability_pct || 90}%` }}
                ></div>
              </div>
            </div>

            <div className="gauge-item">
              <div className="gauge-meta">
                <span>Travel Time Efficiency</span>
                <strong>{scores.travel_efficiency_pct || 80}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-travel"
                  style={{ width: `${scores.travel_efficiency_pct || 80}%` }}
                ></div>
              </div>
            </div>

            <div className="gauge-item">
              <div className="gauge-meta">
                <span>Interest Compatibility</span>
                <strong>{scores.interest_match_pct || 95}%</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-interest"
                  style={{ width: `${scores.interest_match_pct || 95}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Key Tips Strip */}
          {feasibility.key_tips && feasibility.key_tips.length > 0 && (
            <div className="feasibility-tips-box">
              <div className="tips-label">
                <Info size={15} aria-hidden="true" />
                <span>Traveler Advisory:</span>
              </div>
              <ul className="tips-list">
                {feasibility.key_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ── 3. DESTINATIONS RECOMMENDATION GRID ── */}
      <section className="results-section" aria-label="Destination recommendations">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">📍 Top Algorithmic Destination Matches</h3>
            <p className="section-desc">Ranked via multi-criteria decision analysis across budget, rating, and weather.</p>
          </div>
        </div>

        {destinations.length === 0 ? (
          <div className="no-matches-box">
            <h4>No Destinations Matched Strict Criteria</h4>
            <p>Try expanding your maximum travel hours by 1–2 hours or increasing your budget.</p>
          </div>
        ) : (
          <div className="recommendations-grid">
            {destinations.map((d, index) => {
              const imgUrl = DESTINATION_IMAGES[d.name] || FALLBACK_IMAGE;
              const cost = d.cost || {};
              const isWithinBudget = cost.status === "within_budget";
              const weatherSum = d.weather_summary || {};
              const badgeType = d.badge_type || "neutral";

              return (
                <article key={d.name} className="dest-recommendation-card">
                  {/* Image & Floating Badges */}
                  <div className="dest-img-box">
                    <img
                      src={imgUrl}
                      alt={`Landscape view of ${d.name}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="rank-badge">#{index + 1} Best Match</div>

                    <div className="rating-badge">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" aria-hidden="true" />
                      <span>{d.rating}</span>
                    </div>

                    <div className={`composite-score-pill badge-${badgeType}`}>
                      <span>Score: {Math.round((d.score || 0.8) * 100)}%</span>
                      {d.feasibility_badge && <em>• {d.feasibility_badge}</em>}
                    </div>
                  </div>

                  {/* Destination Body */}
                  <div className="dest-card-body">
                    <div className="dest-title-row">
                      <div>
                        <h4>{d.name}</h4>
                        <span className="dest-state">
                          <MapPin size={13} aria-hidden="true" /> {d.state}
                        </span>
                      </div>
                      <span className="travel-hrs-badge">
                        <Clock size={13} aria-hidden="true" /> {d.travel_hours} hrs drive
                      </span>
                    </div>

                    {/* Weather Bar */}
                    <div className={`weather-box ${weatherSum.condition?.includes("Rain") ? "rain-warning" : "clear-weather"}`}>
                      {weatherSum.condition?.includes("Rain") ? (
                        <AlertTriangle size={16} aria-hidden="true" />
                      ) : (
                        <CloudSun size={16} aria-hidden="true" />
                      )}
                      <div>
                        <div className="weather-headline">
                          <strong>{weatherSum.condition || "Pleasant Climate"}</strong>
                          {weatherSum.avg_high && (
                            <span> • High: {weatherSum.avg_high}°C / Low: {weatherSum.avg_low}°C</span>
                          )}
                        </div>
                        <span className="clothing-tip">{weatherSum.clothing_tip || d.weather_warning}</span>
                      </div>
                    </div>

                    {/* Itemized Financial Breakdown */}
                    <div className="cost-breakdown-box">
                      <div className="cost-header">
                        <div>
                          <span className="cost-label">Estimated Total Trip Cost</span>
                          <h4 className="total-cost-val">₹{cost.total?.toLocaleString()}</h4>
                          {cost.per_person && (
                            <span className="per-person-caption">₹{cost.per_person?.toLocaleString()} / person</span>
                          )}
                        </div>
                        <span className={`budget-status-pill ${isWithinBudget ? "status-good" : "status-over"}`}>
                          {isWithinBudget
                            ? `✅ ₹${cost.difference?.toLocaleString()} within budget`
                            : `⚠️ ₹${cost.difference?.toLocaleString()} over budget`}
                        </span>
                      </div>

                      <div className="cost-grid-items">
                        <div className="cost-item">
                          <span><Car size={14} aria-hidden="true" /> Transit</span>
                          <strong>₹{cost.transport?.toLocaleString()}</strong>
                          <small>{cost.transport_details?.mode_label || "Road Transport"}</small>
                        </div>
                        <div className="cost-item">
                          <span><Hotel size={14} aria-hidden="true" /> Stay</span>
                          <strong>₹{cost.hotel?.toLocaleString()}</strong>
                          <small>{cost.hotel_details?.recommended_property || "Boutique Stay"}</small>
                        </div>
                        <div className="cost-item">
                          <span><Utensils size={14} aria-hidden="true" /> Meals</span>
                          <strong>₹{cost.food?.toLocaleString()}</strong>
                          <small>{result.profile?.days} Days Dining</small>
                        </div>
                        <div className="cost-item">
                          <span><Compass size={14} aria-hidden="true" /> Activities</span>
                          <strong>₹{cost.activities?.toLocaleString()}</strong>
                          <small>Fees & Permits</small>
                        </div>
                      </div>

                      {cost.optimization_tip && (
                        <div className="cost-opt-tip">
                          <span>💡 {cost.optimization_tip}</span>
                        </div>
                      )}
                    </div>

                    {/* Activities List */}
                    <div className="activities-row">
                      <span className="act-label">Vibe Tags:</span>
                      {d.activities?.map((act) => (
                        <span key={act} className="act-tag">#{act}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 4. STRUCTURED DAY-BY-DAY ITINERARY ── */}
      {result.itinerary && result.itinerary.length > 0 && (
        <section className="results-section itinerary-section" aria-label="Personalized daily itinerary">
          <h3 className="section-title">
            <Calendar size={20} aria-hidden="true" />
            <span>Customized Day-by-Day Weekend Schedule</span>
          </h3>

          <div className="timeline-wrapper">
            {result.itinerary.map((day) => (
              <div key={day.day} className="timeline-day-card">
                <div className="day-header-strip">
                  <div className="day-badge-wrap">
                    <span className="day-number-badge">Day {day.day}</span>
                    <h4>{day.title || `Day ${day.day}: ${day.destination} Exploration`}</h4>
                  </div>
                  {day.weather_note && (
                    <span className="day-weather-pill">{day.weather_note}</span>
                  )}
                </div>

                {/* Day Schedule Slots */}
                <div className="schedule-slots-grid">
                  <div className="schedule-slot slot-morning">
                    <div className="slot-time">🌅 Morning • 08:30 AM</div>
                    <p>{day.schedule?.morning?.title || day.activities?.[0]}</p>
                  </div>

                  <div className="schedule-slot slot-afternoon">
                    <div className="slot-time">☀️ Afternoon • 01:30 PM</div>
                    <p>{day.schedule?.afternoon?.title || day.activities?.[1]}</p>
                  </div>

                  <div className="schedule-slot slot-evening">
                    <div className="slot-time">🌆 Evening • 06:00 PM</div>
                    <p>{day.schedule?.evening?.title || day.activities?.[2]}</p>
                  </div>
                </div>

                {/* Meal Specialties */}
                {day.recommended_meals && (
                  <div className="day-meals-strip">
                    <span className="meals-label"><Utensils size={14} aria-hidden="true" /> Recommended Regional Cuisines:</span>
                    <span className="meal-tag"><strong>Breakfast:</strong> {day.recommended_meals.breakfast}</span>
                    <span className="meal-tag"><strong>Lunch:</strong> {day.recommended_meals.lunch}</span>
                    <span className="meal-tag"><strong>Dinner:</strong> {day.recommended_meals.dinner}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. PACKING ESSENTIALS & CHECKLIST ── */}
      {result.packing_essentials && result.packing_essentials.length > 0 && (
        <section className="results-section packing-section" aria-label="Trip Packing Checklist">
          <h3 className="section-title">
            <CheckSquare size={20} aria-hidden="true" />
            <span>Smart Weekend Packing Checklist</span>
          </h3>
          <p className="section-desc">Interactive checklist customized for mountain weather and weekend outdoor excursions.</p>

          <div className="checklist-grid">
            {result.packing_essentials.map((item, index) => {
              const isChecked = !!packedItems[index];
              return (
                <button
                  type="button"
                  key={index}
                  className={`checklist-item ${isChecked ? "checked" : ""}`}
                  onClick={() => togglePacked(index)}
                  aria-pressed={isChecked}
                >
                  {isChecked ? (
                    <CheckSquare size={18} className="check-icon-active" aria-hidden="true" />
                  ) : (
                    <Square size={18} className="check-icon-inactive" aria-hidden="true" />
                  )}
                  <span className={isChecked ? "strikethrough" : ""}>{item}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default TripResults;
