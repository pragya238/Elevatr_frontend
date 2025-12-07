import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";
import { useState } from "react";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const { isDark, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Elevatr 🚀</Link>
      </div>

      {/* Hamburger icon for mobile */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-right ${menuOpen ? "show" : ""}`}>
        {!token && <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>}

        {token ? (
          <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/skills" onClick={() => setMenuOpen(false)}>My Skills</Link>
            <Link to="/ai" onClick={() => setMenuOpen(false)}>AI Suggestions</Link>
            <Link to="/goals" onClick={() => setMenuOpen(false)}>Goals</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>

            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}

        <button
          onClick={() => {
            toggleTheme();
            setMenuOpen(false);
          }}
          className="theme-toggle"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
