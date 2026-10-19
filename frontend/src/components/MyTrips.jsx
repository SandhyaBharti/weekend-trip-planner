import {
  Trash2,
  Calendar,
  MapPin,
  Compass,
  ExternalLink,
  BookmarkX,
  Download,
  Users,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import "./MyTrips.css";

function MyTrips({ savedTrips, onDeleteTrip, onViewTrip, onNavigateToPlanner }) {
  const exportAllTrips = () => {
    if (!savedTrips || savedTrips.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedTrips, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `weekend_escapes_trips_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!savedTrips || savedTrips.length === 0) {
    return (
      <div className="my-trips-empty animate-fade-in">
        <div className="empty-icon-box">
          <BookmarkX size={44} className="empty-icon" aria-hidden="true" />
        </div>
        <h2>No Saved Trips Yet</h2>
        <p>You haven&apos;t saved any weekend itineraries yet. Customize your trip parameters and save your favorites to compare and review anytime!</p>
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
        <div>
          <h2>🎒 My Saved Trips ({savedTrips.length})</h2>
          <p>Revisit, compare, and export your persistent weekend itineraries.</p>
        </div>
        <button
          className="btn-export-trips"
          onClick={exportAllTrips}
          aria-label="Export all saved trips as JSON"
        >
          <Download size={16} aria-hidden="true" />
          <span>Export All (JSON)</span>
        </button>
      </div>

      <div className="saved-trips-grid">
        {savedTrips.map((trip) => {
          const mainDest = trip.destinations?.[0];
          const destName = mainDest ? mainDest.name : "Weekend Trip";
          const location = trip.profile?.starting_location || "Origin";
          const people = trip.profile?.people || 2;
          const days = trip.profile?.days || 2;
          const verdict = trip.feasibility_report?.verdict || "FEASIBLE";
          const cost = mainDest?.cost || {};

          return (
            <article key={trip.id} className="saved-trip-card">
              <div className="saved-card-header">
                <span className={`saved-verdict-pill verdict-${verdict.toLowerCase()}`}>
                  <ShieldCheck size={13} aria-hidden="true" />
                  <span>{verdict.replace("_", " ")}</span>
                </span>
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
                <h3>{destName} Weekend Plan</h3>
                <div className="saved-meta-row">
                  <span><MapPin size={13} aria-hidden="true" /> From: {location}</span>
                  <span><Calendar size={13} aria-hidden="true" /> {days} Days</span>
                  <span><Users size={13} aria-hidden="true" /> {people} Pax</span>
                </div>

                {cost.total && (
                  <div className="saved-cost-box">
                    <div>
                      <span className="cost-label">Est. Total Trip Cost</span>
                      <span className="cost-val">₹{cost.total?.toLocaleString()}</span>
                    </div>
                    {cost.per_person && (
                      <span className="saved-per-person">₹{cost.per_person?.toLocaleString()} / pax</span>
                    )}
                  </div>
                )}

                <p className="saved-message">
                  {trip.message || "Custom multi-agent trip recommendation ready."}
                </p>
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
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MyTrips;
