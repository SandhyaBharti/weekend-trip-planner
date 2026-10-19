import { useEffect } from "react";
import { X, MapPin, Clock, Mountain, CheckCircle2, Compass } from "lucide-react";
import "./DestinationModal.css";

const DESTINATION_IMAGES = {
  "Dharamshala": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80",
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80",
  "Dalhousie": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80",
  "Kasol": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80"
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80";

function DestinationModal({ destination, onClose, onPlanTrip }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!destination) return null;

  const imgUrl = DESTINATION_IMAGES[destination.name] || FALLBACK_IMAGE;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dest-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="modal-image-header">
          <img
            src={imgUrl}
            alt={`High resolution view of ${destination.name}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="modal-image-overlay">
            <span className="modal-rating-badge">⭐ {destination.rating} / 5.0</span>
            <h2 id="modal-dest-title">{destination.name}</h2>
            <p><MapPin size={14} aria-hidden="true" /> {destination.state}, India</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-meta-grid">
            <div className="meta-box">
              <Clock className="meta-icon" size={18} aria-hidden="true" />
              <div>
                <span className="meta-label">Est. Travel Duration</span>
                <span className="meta-value">{destination.travel_hours} Hours</span>
              </div>
            </div>

            <div className="meta-box">
              <Mountain className="meta-icon" size={18} aria-hidden="true" />
              <div>
                <span className="meta-label">Coordinates</span>
                <span className="meta-value">{destination.latitude.toFixed(2)}° N, {destination.longitude.toFixed(2)}° E</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Overview</h3>
            <p className="modal-description">
              {destination.description || `${destination.name} is one of the premier weekend travel destinations in ${destination.state}, offering stunning natural vistas, serene outdoor environments, and rich cultural experiences.`}
            </p>
          </div>

          <div className="modal-section">
            <h3>Popular Activities</h3>
            <div className="modal-activities-list">
              {destination.activities.map((act) => (
                <div key={act} className="activity-item">
                  <CheckCircle2 size={16} className="check-icon" aria-hidden="true" />
                  <span>{act.charAt(0).toUpperCase() + act.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="modal-actions">
            <button className="btn-modal-cancel" onClick={onClose}>
              Close
            </button>
            <button
              className="btn-modal-plan"
              onClick={() => {
                onClose();
                onPlanTrip(destination);
              }}
            >
              <Compass size={17} aria-hidden="true" />
              <span>Plan Trip to {destination.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationModal;
