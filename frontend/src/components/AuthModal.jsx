import { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight, Compass } from "lucide-react";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="auth-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close authentication dialog">
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <Compass size={22} className="auth-compass" aria-hidden="true" />
          </div>
          <h2 id="auth-modal-title">{isSignUp ? "Create Your Account" : "Welcome Back"}</h2>
          <p>{isSignUp ? "Sign up to save weekend itineraries & preferences." : "Log in to access your saved trips and custom plans."}</p>
        </div>

        {submitted ? (
          <div className="auth-success-box" role="alert">
            <span className="success-badge">✅ Success</span>
            <h3>{isSignUp ? "Account Created!" : "Logged In Successfully!"}</h3>
            <p>Welcome to Weekend Escapes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="auth-input-group">
                <label htmlFor="auth-name"><User size={15} aria-hidden="true" /> Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="auth-input-group">
              <label htmlFor="auth-email"><Mail size={15} aria-hidden="true" /> Email Address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-password"><Lock size={15} aria-hidden="true" /> Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button className="btn-auth-submit" type="submit">
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <div className="auth-toggle-row">
              <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
              <button
                type="button"
                className="btn-auth-toggle"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
