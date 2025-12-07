import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import "../styles/dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const meRes = await axios.get("/auth/me");
        setUser(meRes.data);

        const skillsRes = await axios.get("/skills");
        setSkills(skillsRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalSkills = skills.length;

  const levelCounts = skills.reduce(
    (acc, skill) => {
      const lvl = (skill.level || "Beginner").toLowerCase();
      if (lvl.startsWith("beg")) acc.beginner++;
      else if (lvl.startsWith("inter")) acc.intermediate++;
      else if (lvl.startsWith("adv")) acc.advanced++;
      return acc;
    },
    { beginner: 0, intermediate: 0, advanced: 0 }
  );

  const strongSkills = levelCounts.intermediate + levelCounts.advanced;
  const focusAreas = levelCounts.beginner;

  const recentSkills = [...skills]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt) -
        new Date(a.createdAt || a.updatedAt)
    )
    .slice(0, 4);

  const lastUpdatedSkill = recentSkills[0];
  const lastUpdatedLabel = lastUpdatedSkill
    ? new Date(
        lastUpdatedSkill.updatedAt || lastUpdatedSkill.createdAt
      ).toLocaleDateString()
    : "No skills yet";

  const pct = (n) =>
    Math.round((n / (totalSkills || 1)) * 100);

  let nextStepMessage =
    totalSkills === 0
      ? "Add your first skill to unlock personalized guidance."
      : focusAreas > 0
      ? "Pick a beginner skill and move it to intermediate."
      : "Nice! Build depth in your strongest skills.";

  const chartData = [
    { name: "Beginner", value: levelCounts.beginner },
    { name: "Intermediate", value: levelCounts.intermediate },
    { name: "Advanced", value: levelCounts.advanced },
  ];

        let motivationLine = "";

      if (totalSkills === 0) {
        motivationLine = "Start small — even one skill can change your entire roadmap.";
      } else if (strongSkills > 0 && focusAreas > 0) {
        motivationLine = "Amazing! Convert your beginner skills into strengths this week.";
      } else if (focusAreas === 0 && strongSkills > 0) {
        motivationLine = "You’re building depth. Now turn these skills into real projects!";
      } else {
        motivationLine = "Keep going — consistent learning compounds faster than you think.";
      }


  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">
          Welcome back, <span>{user?.name?.split(" ")[0] || "buddy"}</span> 👋
        </p>
        <p className="dashboard-subtitle">
          Elevatr tracks your skills & helps you grow smartly.
        </p>
      </div>

      {loading ? (
        <div className="loading">Loading your Elevatr profile…</div>
      ) : (
        <>
          {/* TOP STATS */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <h3>Skills Tracked</h3>
              <p className="stat-value">{totalSkills}</p>
              <p className="stat-hint">These are your tracked skills.</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <h3>Strong Skills</h3>
              <p className="stat-value">{strongSkills}</p>
              <p className="stat-hint">
                Intermediate & Advanced combined.
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <h3>Focus Areas</h3>
              <p className="stat-value">{focusAreas}</p>
              <p className="stat-hint">Beginner skills to improve next.</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🕒</div>
              <h3>Last Updated</h3>
              <p className="stat-value small">{lastUpdatedLabel}</p>
              <p className="stat-hint">Recent skill update activity.</p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="dashboard-content">

            {/* SKILL SNAPSHOT */}
            <section className="dashboard-section">
              <h2>Skill Snapshot</h2>
              

              {totalSkills === 0 ? (
                <p className="empty-state">Add some skills to begin.</p>
              ) : (
                <>
                  <div className="snapshot-bar">
                    <div
                      className="snapshot-segment beginner"
                      style={{ width: `${pct(levelCounts.beginner)}%` }}
                    ></div>

                    <div
                      className="snapshot-segment intermediate"
                      style={{ width: `${pct(levelCounts.intermediate)}%` }}
                    ></div>

                    <div
                      className="snapshot-segment advanced"
                      style={{ width: `${pct(levelCounts.advanced)}%` }}
                    ></div>
                  </div>

                 <div className="snapshot-legend">
                    <span><span className="dot beginner" /> Beginner: {levelCounts.beginner}</span>
                    <span><span className="dot intermediate" /> Intermediate: {levelCounts.intermediate}</span>
                    <span><span className="dot advanced" /> Advanced: {levelCounts.advanced}</span>
                  </div>

                  {/* Motivation line */}
                  <p className="motivation-line">{motivationLine}</p>

                </>
              )}
            </section>

            {/* PIE CHART */}
         <section className="dashboard-section chart-card">
  <h2>Skill Level Distribution</h2>

  {skills.length === 0 ? (
    <p className="empty-state">Add skills to see the chart!</p>
  ) : (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
     <PieChart>
  <defs>
    {/* Beginner Gradient */}
    <linearGradient id="gradBeginner" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#c49a6c" />
      <stop offset="100%" stopColor="#a67c52" />
    </linearGradient>

    {/* Intermediate Gradient (Theme Accent) */}
    <linearGradient id="gradIntermediate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#9BD7E1" />
      <stop offset="100%" stopColor="#7FBAC5" />
    </linearGradient>

    {/* Advanced Gradient */}
    <linearGradient id="gradAdvanced" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#d87a7a" />
      <stop offset="100%" stopColor="#b85c5c" />
    </linearGradient>
  </defs>

  <Pie
    data={[
      { name: "Beginner", value: levelCounts.beginner, fill: "url(#gradBeginner)" },
      { name: "Intermediate", value: levelCounts.intermediate, fill: "url(#gradIntermediate)" },
      { name: "Advanced", value: levelCounts.advanced, fill: "url(#gradAdvanced)" },
    ]}
    dataKey="value"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={95}
    paddingAngle={4}
    animationDuration={900}
    animationBegin={200}
  />


          {/* Center Label */}
          <text
            x="50%"
            y="50%"
            className="chart-center-text"
          >
            {totalSkills} Skills
          </text>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</section>
{/* AI Section */}
<section className="dashboard-section">
  <h2>AI Growth Overview</h2>
  <div className="ai-card">
    <div className="ai-pill">Smart Insight</div>
    <h3 className="ai-title">
      {totalSkills === 0
        ? "Start by mapping your current skillset"
        : focusAreas > 0
        ? "Grow your Beginner skills into strengths"
        : "Deepen your strongest skills with projects"}
    </h3>

    <p className="ai-text">
      {totalSkills === 0 &&
        "Add the skills you know & want to learn. Elevatr creates your growth map."}

      {totalSkills > 0 && focusAreas > 0 &&
        "Focus on one Beginner skill weekly to level up faster."}

      {totalSkills > 0 && focusAreas === 0 &&
        "You now need depth—build projects, case studies & interview-style problems."}
    </p>

    <button className="btn-ai" onClick={() => navigate("/ai")}>
      View detailed AI suggestions
    </button>
  </div>
</section>
          {/* GOALS MINI WIDGET */}
<section className="dashboard-section">
  <h2>Goals Tracker</h2>

  <div className="goals-mini-card">
    <p className="goals-mini-text">Track your weekly learning progress.</p>

    <button
      className="goals-mini-btn"
      onClick={() => navigate("/goals")}
    >
      Open Goals Page
    </button>
  </div>
</section>



            {/* RECENT SKILLS */}
            <section className="dashboard-section full-width">
              <h2>Recently Added Skills</h2>

              {recentSkills.length === 0 ? (
                <p className="empty-state">No recent skills.</p>
              ) : (
                <div className="recent-grid">
                  {recentSkills.map((skill) => (
                    <div key={skill._id} className="recent-card">
                      <div className="recent-header">
                        <span className="recent-name">{skill.name}</span>
                        <span className={`level-chip ${skill.level.toLowerCase()}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="recent-date">
                        Added on {new Date(skill.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section full-width next-steps-card">
  <h2>Next Steps from Elevatr</h2>

  <div className="next-steps-card">
    <p className="next-step-main">{nextStepMessage}</p>
    <ul className="next-step-list">
      <li>Keep your skills updated after every new project.</li>
      <li>Use <strong>AI Suggestions</strong> to choose what to learn.</li>
      <li>Visit this dashboard weekly to track your growth.</li>
    </ul>
  </div>
</section>


            {/* RESUME BUILDER CTA */}
            <section className="dashboard-section full-width resume-builder">
              <h2>Resume Builder</h2>
              <p className="resume-desc">
                Elevatr auto-generates a professional resume based on your skill profile.
              </p>

              <div className="resume-card-container">
                <div className="resume-left">
                  <h3 className="resume-title">Generate Your Smart Resume</h3>
                  <p className="resume-text">
                    Click below to build a clean, formatted resume instantly.
                  </p>

                  <button
                    onClick={() => navigate("/resume")}
                    className="resume-btn-pro"
                  >
                    Build Resume
                  </button>
                </div>

                <div className="resume-preview">
                  <div className="preview-card">
                    <div className="preview-top"></div>
                    <div className="preview-line mid"></div>
                    <div className="preview-line"></div>
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </>
      )}
    </div>
  );
}
