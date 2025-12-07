import "../styles/global.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="hero-title">Elevatr 🚀</h1>
        <p className="hero-subtitle">
          AI-powered career growth ecosystem built for students & learners
        </p>
        <p className="hero-description">
          Unlock your potential with personalized learning paths, expert mentorship, and industry-ready skills training.
        </p>

        <div className="home-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Structured Learning</h3>
          <p>Curated courses designed by industry experts</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered</h3>
          <p>Personalized recommendations and adaptive learning paths</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Community</h3>
          <p>Learn together with peers and mentors</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Career Ready</h3>
          <p>Get job-ready with real-world projects and certifications</p>
        </div>
      </div>
    </div>
  );
}
