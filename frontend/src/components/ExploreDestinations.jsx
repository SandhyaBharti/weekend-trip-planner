import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ArrowUpRight,
  Compass,
  XCircle,
  Sparkles,
  SlidersHorizontal,
  Mountain,
  Sun,
  ShieldCheck,
  ArrowRight,
  X
} from "lucide-react";
import "./ExploreDestinations.css";

const DESTINATION_IMAGES = {
  "Dharamshala": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80",
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80",
  "Dalhousie": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80",
  "Kasol": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80"
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80";

const SAMPLE_DESTINATIONS = [
  {
    name: "Dharamshala",
    state: "Himachal Pradesh",
    latitude: 32.219,
    longitude: 76.323,
    travel_hours: 4,
    rating: 4.5,
    highlight: "Tibetan Culture & Triund Trek",
    activities: ["mountains", "peaceful", "trekking", "nature"],
    description: "Nestled in the upper reaches of Kangra Valley, famous for serene monasteries, panoramic Dhauladhar mountain peaks, and the iconic Triund ridge trek."
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    latitude: 32.2432,
    longitude: 77.1892,
    travel_hours: 7,
    rating: 4.6,
    highlight: "Snow Peaks & Solang Adventure",
    activities: ["mountains", "trekking", "adventure", "nature"],
    description: "A high-altitude Himalayan resort town renowned for snow-capped panoramas, Solang Valley paragliding, Beas river rafting, and cozy mountain cafes."
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    latitude: 30.0869,
    longitude: 78.2676,
    travel_hours: 6,
    rating: 4.4,
    highlight: "River Rafting & Ganga Aarti",
    activities: ["adventure", "trekking", "nature", "peaceful"],
    description: "The Yoga Capital of the World along the holy emerald Ganges, offering thrilling Grade-IV white-water rafting, cliff jumping, and peaceful sunset Aartis."
  },
  {
    name: "Dalhousie",
    state: "Himachal Pradesh",
    latitude: 32.5356,
    longitude: 75.528,
    travel_hours: 5,
    rating: 4.5,
    highlight: "Colonial Charm & Khajjiar Meadows",
    activities: ["mountains", "peaceful", "nature"],
    description: "A tranquil hill station built across five pine-clad hills, featuring Scottish colonial architecture, fresh mountain air, and the 'Mini Switzerland' of Khajjiar."
  },
  {
    name: "Kasol",
    state: "Himachal Pradesh",
    latitude: 32.0098,
    longitude: 77.3149,
    travel_hours: 6,
    rating: 4.4,
    highlight: "Parvati River & Kheerganga Trail",
    activities: ["mountains", "trekking", "peaceful", "nature"],
    description: "A scenic riverside hamlet in Parvati Valley, widely celebrated for pristine mountain air, bohemian riverside cafes, and trails to natural hot springs."
  }
];

function ExploreDestinations({ onSelectDestination, onPlanForDestination, onPlanMyWeekend }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("all");

  const activitiesList = ["all", "mountains", "trekking", "adventure", "peaceful", "nature"];

  const filteredDestinations = SAMPLE_DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.activities.some((act) => act.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActivity = selectedActivity === "all" || dest.activities.includes(selectedActivity);
    return matchesSearch && matchesActivity;
  });

  const scrollToFilters = () => {
    const el = document.getElementById("explore-controls-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="explore-container">
      {/* ── 1. TRAVEL HERO SECTION ── */}
      <section className="explore-hero animate-fade-in" aria-label="Explore Destinations Hero">
        <div className="explore-hero-backdrop">
          <div className="hero-gradient-orb orb-1"></div>
          <div className="hero-gradient-orb orb-2"></div>
        </div>

        <div className="explore-hero-inner">
          <div className="explore-hero-text">
            <div className="explore-hero-badge">
              <Sparkles size={14} className="sparkle-icon" aria-hidden="true" />
              <span>Handpicked Weekend Escapes • 4–7 Hrs Away</span>
            </div>

            <h1 className="explore-hero-title">
              Find Your Next Weekend <span className="highlight-gradient">Sanctuary</span>
            </h1>

            <p className="explore-hero-subtitle">
              Browse verified hill stations, alpine valleys, and adventure getaways optimized for short breaks.
              Every destination is evaluated with real-time weather forecasts, travel hours, and transparent budgets.
            </p>

            {/* Clear "Plan My Weekend" Primary CTA + Filter Secondary CTA */}
            <div className="explore-hero-cta-group">
              <button
                className="btn-plan-weekend-cta"
                onClick={onPlanMyWeekend}
                aria-label="Plan My Weekend using AI Trip Planner"
              >
                <Compass size={18} aria-hidden="true" />
                <span>Plan My Weekend</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <button
                className="btn-hero-filter"
                onClick={scrollToFilters}
                aria-label="Filter and browse destinations"
              >
                <SlidersHorizontal size={17} aria-hidden="true" />
                <span>Browse Destinations</span>
              </button>
            </div>

            {/* Value Badges */}
            <div className="explore-hero-stats">
              <div className="hero-stat-item">
                <Mountain size={16} className="stat-icon" aria-hidden="true" />
                <span><strong>5+</strong> Scenic Hill Stations</span>
              </div>
              <div className="hero-stat-item">
                <Clock size={16} className="stat-icon" aria-hidden="true" />
                <span><strong>≤ 7 hrs</strong> Travel Time</span>
              </div>
              <div className="hero-stat-item">
                <Sun size={16} className="stat-icon" aria-hidden="true" />
                <span><strong>Live</strong> Weather Data</span>
              </div>
              <div className="hero-stat-item">
                <ShieldCheck size={16} className="stat-icon" aria-hidden="true" />
                <span><strong>AI</strong> Budget Match</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Preview Card */}
          <div className="explore-hero-visual" aria-hidden="true">
            <div className="hero-visual-card main-card">
              <img
                src={DESTINATION_IMAGES["Manali"]}
                alt="Manali landscape"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="visual-card-content">
                <div className="visual-card-pill">
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <span>4.6 • Top Rated</span>
                </div>
                <h3>Manali, Himachal</h3>
                <p>Snow-capped peaks, rafting & alpine pine trails</p>
              </div>
            </div>

            <div className="hero-visual-badge-floating">
              <span className="dot-pulse"></span>
              <span>Live Weather Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER & SEARCH SECTION ── */}
      <section
        id="explore-controls-section"
        className="explore-controls-section"
        aria-label="Filter destinations"
      >
        <div className="controls-header">
          <div>
            <h2 className="controls-heading">Explore Curated Destinations</h2>
            <p className="controls-subheading">
              Filter by travel vibe or search directly by city, state, or activity tag.
            </p>
          </div>
          <div className="results-count-chip">
            Showing <strong>{filteredDestinations.length}</strong> of {SAMPLE_DESTINATIONS.length} spots
          </div>
        </div>

        <div className="explore-controls-bar">
          {/* Search Box */}
          <div className="search-box">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by destination, state, or activity (e.g. trekking)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search destinations by name, state, or activity"
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="activity-filters" role="group" aria-label="Filter by activity tag">
            {activitiesList.map((activity) => (
              <button
                key={activity}
                className={`activity-tag ${selectedActivity === activity ? "active" : ""}`}
                onClick={() => setSelectedActivity(activity)}
                aria-pressed={selectedActivity === activity}
              >
                {activity === "all" ? "All Vibe" : `#${activity}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. DESTINATIONS GRID / EMPTY STATE ── */}
      {filteredDestinations.length === 0 ? (
        <div className="explore-empty-state animate-fade-in" role="status">
          <div className="empty-icon-wrap">
            <XCircle size={44} className="empty-icon" />
          </div>
          <h3>No Destinations Found</h3>
          <p>
            No weekend spots match &quot;<strong>{searchTerm}</strong>&quot; with the selected filters.
            Try searching for another activity or reset all filters.
          </p>
          <button
            className="btn-reset-filters"
            onClick={() => {
              setSearchTerm("");
              setSelectedActivity("all");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="explore-grid" role="list">
          {filteredDestinations.map((dest) => {
            const imgUrl = DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE;

            return (
              <article
                key={dest.name}
                className="destination-card animate-fade-in"
                role="listitem"
              >
                {/* Image Container with Consistent 16:10 Aspect Ratio & Graceful Fallback */}
                <div className="card-image-box">
                  <img
                    src={imgUrl}
                    alt={`Scenic landscape view of ${dest.name}, ${dest.state}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="image-shimmer-bg" aria-hidden="true"></div>

                  {/* Top Badges */}
                  <div className="card-overlay-badge rating-badge">
                    <Star size={13} fill="#F59E0B" color="#F59E0B" aria-hidden="true" />
                    <span>{dest.rating}</span>
                  </div>

                  <div className="card-overlay-badge travel-time-badge">
                    <Clock size={13} aria-hidden="true" />
                    <span>{dest.travel_hours} hrs</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-content">
                  <div className="card-top-row">
                    <div>
                      <h3 className="card-title">{dest.name}</h3>
                      <span className="state-subtitle">
                        <MapPin size={13} aria-hidden="true" /> {dest.state}
                      </span>
                    </div>
                    {dest.highlight && (
                      <span className="dest-highlight-pill">{dest.highlight}</span>
                    )}
                  </div>

                  <p className="card-desc">{dest.description}</p>

                  {/* Activity Tags */}
                  <div className="activities-tags" aria-label="Destination activities">
                    {dest.activities.map((act) => (
                      <span key={act} className="act-chip">
                        #{act}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="card-footer-actions">
                    <button
                      className="btn-view-details"
                      onClick={() => onSelectDestination(dest)}
                      aria-label={`View full details for ${dest.name}`}
                    >
                      View Details
                    </button>

                    <button
                      className="btn-quick-plan"
                      onClick={() => onPlanForDestination(dest)}
                      aria-label={`Plan trip to ${dest.name}`}
                    >
                      <span>Plan Trip</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExploreDestinations;
