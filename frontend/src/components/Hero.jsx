import { Sparkles, MapPin, Compass, ShieldCheck, Sun, DollarSign, ArrowRight } from "lucide-react";
import "./Hero.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80";

function Hero({ onStartPlanning, onExplore }) {
  const featuredHighlights = [
    {
      title: "Dharamshala",
      state: "Himachal Pradesh",
      tag: "Popular Choice",
      rating: "4.5 ⭐",
      img: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Manali",
      state: "Himachal Pradesh",
      tag: "Top Rated",
      rating: "4.6 ⭐",
      img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Rishikesh",
      state: "Uttarakhand",
      tag: "Adventure Hub",
      rating: "4.4 ⭐",
      img: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge animate-fade-in">
          <Sparkles size={14} className="badge-sparkle" aria-hidden="true" />
          <span>Smart Weekend Itinerary Engine</span>
        </div>

        <h1 className="hero-headline animate-fade-in">
          Plan Your Perfect Weekend Trip <span className="highlight-text">Easily.</span>
        </h1>

        <p className="hero-description animate-fade-in">
          Discover handpicked mountain & adventure getaways tailored to your budget, travel duration, group size, and live weather forecasts.
        </p>

        {/* CTA Group */}
        <div className="hero-actions animate-fade-in">
          <button className="btn-hero-primary" onClick={onStartPlanning} aria-label="Plan My Trip Now">
            <Compass size={18} aria-hidden="true" />
            <span>Plan My Trip Now</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <button className="btn-hero-secondary" onClick={onExplore} aria-label="Explore Destinations">
            <MapPin size={18} aria-hidden="true" />
            <span>Explore Destinations</span>
          </button>
        </div>

        {/* Value Props */}
        <div className="hero-features-strip">
          <div className="feature-pill">
            <ShieldCheck size={16} className="feature-icon" aria-hidden="true" />
            <span>Instant Budget Match</span>
          </div>
          <div className="feature-pill">
            <Sun size={16} className="feature-icon" aria-hidden="true" />
            <span>Live Weather Alerts</span>
          </div>
          <div className="feature-pill">
            <DollarSign size={16} className="feature-icon" aria-hidden="true" />
            <span>Itemized Travel Breakdown</span>
          </div>
        </div>
      </div>

      {/* Featured Destinations Row */}
      <div className="hero-cards-grid animate-fade-in">
        <div className="grid-header">
          <h3>Featured Getaways</h3>
          <button className="link-see-all" onClick={onExplore} aria-label="View all destinations">
            View All →
          </button>
        </div>

        <div className="cards-row">
          {featuredHighlights.map((dest) => (
            <button
              key={dest.title}
              className="hero-card"
              onClick={onExplore}
              aria-label={`Explore ${dest.title}, ${dest.state}`}
            >
              <div className="hero-card-img-wrapper">
                <img
                  src={dest.img}
                  alt={`Scenery of ${dest.title}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <span className="card-badge">{dest.tag}</span>
              </div>
              <div className="hero-card-info">
                <h4>{dest.title}</h4>
                <div className="hero-card-meta">
                  <span>📍 {dest.state}</span>
                  <span className="rating-pill">{dest.rating}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
