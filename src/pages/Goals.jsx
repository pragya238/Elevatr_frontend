import { useState, useEffect } from "react";
import axios from "../config/axios";
import "../styles/goals.css";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const res = await axios.get("/goals");
    setGoals(res.data);
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;

    const res = await axios.post("/goals", { text: newGoal });
    setGoals([res.data, ...goals]);
    setNewGoal("");
  };

  const updateProgress = async (id, value) => {
    const res = await axios.put(`/goals/${id}`, { progress: value });

    setGoals(goals.map((g) => (g._id === id ? res.data : g)));
  };

  const deleteGoal = async (id) => {
    await axios.delete(`/goals/${id}`);
    setGoals(goals.filter((g) => g._id !== id));
  };

  return (
    <div className="goals-wrapper">
      <h1 className="goals-title">Your Learning Goals</h1>

      <div className="goal-input-container">
        <input
          className="goal-input"
          placeholder="Add a new goal…"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button className="add-goal-btn" onClick={addGoal}>
          Add
        </button>
      </div>

      {goals.length === 0 && (
        <p className="empty-goals">Add your first goal and start tracking 🚀</p>
      )}

      <div className="goals-list">
        {goals.map((goal) => (
          <div key={goal._id} className="goal-card">
            <div className="goal-header">
              <h3 className="goal-text">{goal.text}</h3>
              <button className="delete-goal-btn" onClick={() => deleteGoal(goal._id)}>
                ✕
              </button>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => updateProgress(goal._id, e.target.value)}
              className="goal-slider"
            />

            <p className="goal-progress">{goal.progress}% completed</p>
          </div>
        ))}
      </div>
    </div>
  );
}
