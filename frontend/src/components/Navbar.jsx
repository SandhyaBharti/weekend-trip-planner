import { useState, useRef, useEffect } from "react";
import { Compass, MapPin, Calendar, Heart, User, Menu, X, Sparkles, LogOut, ChevronDown } from "lucide-react";
import "./Navbar.css";

function Navbar({ activeTab, setActiveTab, onOpenAuth, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Compass },
    { id: "explore", label: "Explore", icon: MapPin },
    { id: "planner", label: "Trip Planner", icon: Calendar },
    { id: "saved", label: "My Trips", icon: Heart },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="navbar-container" role="banner">
      <div className="navbar-inner">
        
        {/* Brand Logo */}
        <button
          className="navbar-brand"
          onClick={() => handleNavClick("home")}
          aria-label="WeekendEscapes Home"
        >
          <div className="logo-icon-wrapper">
            <Compass className="logo-icon" size={22} aria-hidden="true" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Weekend<span className="text-accent">Escapes</span></span>
            <span className="brand-subtitle">Smart Trip Planner</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="nav-icon" size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button 
            className="btn-plan-now"
            onClick={() => handleNavClick("planner")}
            aria-label="Start Planning a Trip"
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>Plan Trip</span>
          </button>

          {user ? (
            <div className="navbar-user-dropdown-container" ref={dropdownRef}>
              <button
                className="btn-user-profile-badge"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label={`User profile for ${user.name}`}
              >
                <div className="user-avatar-circle">
                  {user.avatarInitial || user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <span className="user-display-name">{user.name}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? "open" : ""}`} aria-hidden="true" />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu animate-fade-in" role="menu">
                  <div className="dropdown-user-header">
                    <p className="dropdown-user-greeting">Signed in as</p>
                    <p className="dropdown-user-email">{user.email || user.name}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavClick("saved")}
                    role="menuitem"
                  >
                    <Heart size={15} aria-hidden="true" />
                    <span>My Saved Trips</span>
                  </button>
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    role="menuitem"
                  >
                    <LogOut size={15} aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn-user-auth"
              onClick={onOpenAuth}
              aria-label="Sign In or Account"
            >
              <User size={17} aria-hidden="true" />
              <span className="auth-label">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="btn-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-drawer animate-fade-in" aria-label="Mobile Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`mobile-nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mobile-drawer-divider" />

          {user ? (
            <div className="mobile-user-profile-box">
              <div className="mobile-user-info">
                <div className="user-avatar-circle">
                  {user.avatarInitial || user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="user-display-name">{user.name}</div>
                  <div className="mobile-user-email">{user.email || "Active Profile"}</div>
                </div>
              </div>
              <button 
                className="mobile-logout-btn"
                onClick={() => {
                  if (onLogout) onLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button 
              className="mobile-auth-btn"
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
            >
              <User size={18} aria-hidden="true" />
              <span>Sign In / Register</span>
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
