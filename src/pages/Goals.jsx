import { useEffect, useState } from "react";
import api from "../config/axios";
import "../styles/goals.css";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [sort, setSort] = useState("latest");
  const [progressFilter, setProgressFilter] = useState("");

  // Fetch goals from backend
  const fetchGoals = async () => {
    const res = await api.get(`/goals?sort=${sort}&progress=${progressFilter}`);
    setGoals(res.data);
  };

  useEffect(() => {
    fetchGoals();
  }, [sort, progressFilter]);

  // Add new goal
  const addGoal = async () => {
    if (!newGoal.trim()) return;
    await api.post("/goals", { text: newGoal });
    setNewGoal("");
    fetchGoals();
  };

  // Update progress
  const updateProgress = async (id, value) => {
    await api.put(`/goals/${id}`, { progress: value });
    fetchGoals();
  };

  // Delete goal
  const deleteGoal = async (id) => {
    await api.delete(`/goals/${id}`);
    fetchGoals();
  };

  return (
  <div className="goals-wrapper">
    <h2 className="goals-title">Your Goals</h2>

    {/* Input + Filters */}
    <div className="goals-top">

      {/* Add Goal */}
      <div className="goal-input-container">
        <input
          className="goal-input"
          placeholder="Enter your goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button className="add-goal-btn" onClick={addGoal}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="goal-filter-sort">
        <select
          className="goal-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="high-progress">High Progress</option>
          <option value="low-progress">Low Progress</option>
        </select>

        <select
          className="goal-select"
          value={progressFilter}
          onChange={(e) => setProgressFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="0">Not Started (0%)</option>
          <option value="50">Halfway (50%)</option>
          <option value="100">Completed (100%)</option>
        </select>
      </div>
    </div>

    {/*  GOALS LIST */}
    <div className="goals-list">
      {goals.map((g) => (
        <div key={g._id} className="goal-card">

          <div className="goal-header">
            <p className="goal-text">{g.text}</p>
            <button className="delete-goal-btn" onClick={() => deleteGoal(g._id)}>
              ✕
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={g.progress}
            onChange={(e) => updateProgress(g._id, e.target.value)}
            className="goal-slider"
          />

          <div className="goal-meta">
            <span className="goal-progress">{g.progress}%</span>
          </div>

        </div>
      ))}
    </div>
  </div>
);

}
