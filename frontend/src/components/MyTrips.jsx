import { Trash2, Calendar, MapPin, Compass, ExternalLink, BookmarkX } from "lucide-react";
import "./MyTrips.css";

function MyTrips({ savedTrips, onDeleteTrip, onViewTrip, onNavigateToPlanner }) {
  if (!savedTrips || savedTrips.length === 0) {
    return (
      <div className="my-trips-empty animate-fade-in">
        <div className="empty-icon-box">
          <BookmarkX size={44} className="empty-icon" aria-hidden="true" />
        </div>
        <h2>No Saved Trips Yet</h2>
        <p>You haven't saved any weekend trip plans. Customize your trip parameters and save your favorites to view them anytime!</p>
        <button className="btn-empty-plan" onClick={onNavigateToPlanner} aria-label="Plan a weekend trip now">
          <Compass size={17} aria-hidden="true" />
          <span>Plan a Weekend Trip Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="my-trips-container animate-fade-in">
      <div className="my-trips-header">
        <h2>🎒 My Saved Trips</h2>
        <p>Manage and revisit your saved weekend itineraries.</p>
      </div>

      <div className="saved-trips-grid">
        {savedTrips.map((trip) => {
          const mainDest = trip.destinations?.[0];
          const destName = mainDest ? mainDest.name : "Weekend Trip";
          const location = trip.profile?.starting_location || "Origin";

          return (
            <div key={trip.id} className="saved-trip-card">
              <div className="saved-card-header">
                <div className="saved-badge">Saved Plan</div>
                <button
                  className="btn-delete-trip"
                  onClick={() => onDeleteTrip(trip.id)}
                  aria-label={`Remove saved trip to ${destName}`}
                  title="Remove Trip"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="saved-card-body">
                <h3>{destName} Weekend Escape</h3>
                <div className="saved-meta-row">
                  <span><MapPin size={14} aria-hidden="true" /> From: {location}</span>
                  <span><Calendar size={14} aria-hidden="true" /> {trip.profile?.days || 2} Days</span>
                </div>

                {mainDest?.cost && (
                  <div className="saved-cost-box">
                    <span className="cost-label">Est. Total Budget</span>
                    <span className="cost-val">₹{mainDest.cost.total?.toLocaleString()}</span>
                  </div>
                )}

                <p className="saved-message">{trip.message}</p>
              </div>

              <div className="saved-card-footer">
                <button
                  className="btn-view-saved"
                  onClick={() => onViewTrip(trip)}
                  aria-label={`View full itinerary for ${destName}`}
                >
                  <span>View Full Itinerary</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyTrips;
