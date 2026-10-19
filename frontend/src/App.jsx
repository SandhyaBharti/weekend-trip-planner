import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ExploreDestinations from "./components/ExploreDestinations";
import DestinationModal from "./components/DestinationModal";
import TripPlannerForm from "./components/TripPlannerForm";
import TripResults from "./components/TripResults";
import MyTrips from "./components/MyTrips";
import AuthModal from "./components/AuthModal";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Form state — exactly matching backend TripRequest schema. No changes here.
  const [form, setForm] = useState({
    location: "Delhi",
    budget: 15000,
    days: 2,
    people: 2,
    relationship: "couple",
    interests: ["mountains", "trekking"],
    max_travel_hours: 6,
    start_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Saved Trips — persisted via localStorage (no database in original project)
  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const stored = localStorage.getItem("weekend_planner_saved_trips");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("weekend_planner_saved_trips", JSON.stringify(savedTrips));
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
  }, [savedTrips]);

  // ── Trip planning: calls POST /plan-trip — unchanged business logic ──
  const planTrip = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          days: Number(form.days),
          people: Number(form.people),
          max_travel_hours: Number(form.max_travel_hours)
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        const enrichedResult = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        setResult(enrichedResult);
        setActiveTab("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Could not connect to backend API. Make sure the FastAPI server is running on port 8000.");
      setResult(null);
    }

    setLoading(false);
  };

  // Pre-fill form interests & max hours from a destination card click
  const handleQuickPlanDestination = (dest) => {
    setForm((prev) => ({
      ...prev,
      interests: Array.from(new Set([...prev.interests, ...dest.activities])),
      max_travel_hours: Math.max(prev.max_travel_hours, dest.travel_hours)
    }));
    setActiveTab("planner");
  };

  const handleSaveTrip = (tripToSave) => {
    if (!tripToSave) return;
    setSavedTrips((prev) => {
      const exists = prev.some((t) => t.id === tripToSave.id);
      if (exists) return prev;
      return [tripToSave, ...prev];
    });
  };

  const handleDeleteSavedTrip = (id) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleViewSavedTrip = (trip) => {
    setResult(trip);
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      {/* ── Sticky Navigation ── */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* ── Main View ── */}
      <main className="main-content" id="main-content">

        {activeTab === "home" && (
          <Hero
            onStartPlanning={() => navigateTo("planner")}
            onExplore={() => navigateTo("explore")}
          />
        )}

        {activeTab === "explore" && (
          <ExploreDestinations
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onPlanForDestination={(dest) => handleQuickPlanDestination(dest)}
            onPlanMyWeekend={() => navigateTo("planner")}
          />
        )}

        {activeTab === "planner" && (
          <TripPlannerForm
            form={form}
            setForm={setForm}
            onSubmit={planTrip}
            loading={loading}
            error={error}
          />
        )}

        {activeTab === "results" && (
          <>
            {/* Back link — pure UI navigation, no logic change */}
            <div className="results-back-strip">
              <button
                className="btn-back-to-planner"
                onClick={() => navigateTo("planner")}
                aria-label="Back to Trip Planner"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to Trip Planner
              </button>
            </div>
            <TripResults
              result={result}
              onSaveTrip={handleSaveTrip}
              savedTripIds={savedTrips.map((t) => t.id)}
            />
          </>
        )}

        {activeTab === "saved" && (
          <MyTrips
            savedTrips={savedTrips}
            onDeleteTrip={handleDeleteSavedTrip}
            onViewTrip={handleViewSavedTrip}
            onNavigateToPlanner={() => navigateTo("planner")}
          />
        )}

      </main>

      {/* ── Destination Detail Modal ── */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onPlanTrip={(dest) => handleQuickPlanDestination(dest)}
        />
      )}

      {/* ── Auth Modal (frontend-only UI) ── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* ── Footer ── */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Weekend<span>Escapes</span></div>
            <p>Smart AI Weekend Trip Planner</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <button onClick={() => navigateTo("explore")}>Explore</button>
            <button onClick={() => navigateTo("planner")}>Plan a Trip</button>
            <button onClick={() => navigateTo("saved")}>My Trips</button>
            <button onClick={() => setIsAuthOpen(true)}>Sign In</button>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;