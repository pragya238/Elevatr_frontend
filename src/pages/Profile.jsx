import { useEffect, useState } from "react";
import axios from "../config/axios";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function load() {
      const u = await axios.get("/auth/me");
      const sk = await axios.get("/skills");

      setUser(u.data);
      setSkills(sk.data || []);
    }
    load();
  }, []);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <section className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <h3 className="profile-section-title">Basic Info</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="profile-card">
        <h3 className="profile-section-title">My Skills</h3>
        <ul className="skills-list">
          {skills.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </div>

      <div className="profile-card">
        <h3 className="profile-section-title">Resume</h3>
        <p>You can generate or download your resume from the Resume Builder page.</p>
      </div>
    </section>
  );
}
