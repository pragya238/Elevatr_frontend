import { useState, useEffect } from "react";
import api from "../config/axios";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/skills.css";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  // NEW FILTER + SORT STATES 
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("az");

  // Load skills with backend filtering + sorting
  const loadSkills = async () => {
    try {
      const res = await api.get(
        `/skills?level=${filter}&sort=${sort}`
      );
      setSkills(res.data);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [filter, sort]);

  // ADD Skill
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

  // DELETE Skill
  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      loadSkills();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // UPDATE Level
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

        {/* 🔥 FILTER + SORT */}
        <div className="filter-sort-box">
          <select
            className="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Add Skill */}
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

        {/*  Skills Table */}
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
                    <button
                      className="delete-btn"
                      onClick={() => deleteSkill(skill._id)}
                    >
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
