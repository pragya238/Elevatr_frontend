import { useState, useEffect } from "react";
import api from "../config/axios";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/skills.css";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const loadSkills = async () => {
    try {
      const res = await api.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };
  useEffect(() => {
    loadSkills();
  }, []);
  const addSkill = async () => {
    if (!name.trim()) return alert("Skill name required");
    try {
      setLoading(true);
      await api.post("/skills", { name, level });
      setName("");
      setLevel("Beginner");
      await loadSkills();
    } catch (err) {
      console.log("ADD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      loadSkills();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  const updateLevel = async (id, newLevel) => {
    try {
      await api.put(`/skills/${id}`, { level: newLevel });
      loadSkills();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="skills-page">
        <h1 className="skills-title">Your Skills</h1>

        <div className="add-skill-box">
          <input
            className="input"
            placeholder="Skill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button className="btn" onClick={addSkill} disabled={loading}>
            {loading ? "Adding…" : "Add Skill"}
          </button>
        </div>

        <div className="skills-table-wrapper">
          <table className="skills-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill._id}>
                  <td>{skill.name}</td>
                  <td>
                    <select
                      className="select small"
                      value={skill.level}
                      onChange={(e) => updateLevel(skill._id, e.target.value)}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </td>
                  <td>{new Date(skill.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => { if(confirm('Delete skill?')) deleteSkill(skill._id); }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
