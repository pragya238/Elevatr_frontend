import { useState, useEffect } from "react";
import axios from "../config/axios";
import "../styles/dashboard.css";
import "../styles/ResumeSection.css"; 
import { jsPDF } from "jspdf";

export default function ResumeSection() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");

  // form fields
  const [project1, setProject1] = useState("");
  const [project2, setProject2] = useState("");
  const [project3, setProject3] = useState("");
  const [degree, setDegree] = useState("");
  const [years, setYears] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const me = await axios.get("/auth/me");
        const sk = await axios.get("/skills");

        setUser(me.data);
        setSkills(sk.data || []);
      } catch (err) {
        console.error("Resume load error:", err);
      }
    }
    load();
  }, []);

  // ============================================================
  //              ⭐ DYNAMIC RESUME GENERATOR ⭐
  // ============================================================
  const generateResume = () => {
    const name = user?.name || "User";
    const email = user?.email || "example@email.com";

    const skillNames = skills.map((s) => s.name);
    const topSkills = skillNames.slice(0, 3).join(", ");

    const projectList = [project1, project2, project3].filter(Boolean);

    let summaryText = "";

    // If user has skills → generate skill-based summary
    if (skillNames.length > 0) {
      summaryText = `
A motivated ${degree || "student"} with hands-on experience in ${topSkills}. 
Strong problem-solving mindset with the ability to build functional and clean UI projects. 
Experienced in working on ${projectList[0] || "multiple beginner-level projects"}, and committed 
to continuous learning and improvement.
`.trim();
    } 
    // If user has no skills saved
    else {
      summaryText = `
A highly driven ${degree || "student"} focused on hands-on learning and improving technical skills. 
Passionate about building real-world applications and growing through active practice.
`.trim();
    }

    const template = `
${name}
${degree || "B.Tech – Computer Science & AI"} ${years || "(2023–2027)"}
Email: ${email}
--------------------------------------------------------

SUMMARY
${summaryText}

SKILLS
${skillNames.length > 0 ? skillNames.join(", ") : "-"}

PROJECTS
${project1 ? "• " + project1 : ""}
${project2 ? "• " + project2 : ""}
${project3 ? "• " + project3 : ""}
`;

    setGeneratedResume(template.trim());
    setShowForm(false); // move to the result page
  };
  const downloadPDF = () => {
  if (!generatedResume) return;

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const left = 40;
  const top = 40;
  const lineHeight = 18;

  const lines = generatedResume.split("\n");
  let y = top;

  doc.setFont("Helvetica", "normal");

  lines.forEach((line) => {
    if (y > 780) {
      doc.addPage();
      y = top;
    }
    doc.text(line, left, y);
    y += lineHeight;
  });

  doc.save(`${user?.name || "resume"}.pdf`);
};


  return (
    <section className="dashboard-section full-width resume-section">
      <h2>Resume Builder</h2>

      {/* ------------------- STEP 1 — MAIN CARD ------------------- */}
      {!showForm && !generatedResume && (
        <div className="resume-card-container">
          <div className="resume-left">
            <span className="resume-pill">SMART RESUME</span>

            <h3 className="resume-big-title">Generate Your Smart Resume</h3>

            <p className="resume-text">
              Based on your skills, strengths & updates, Elevatr builds a clean,
              professional ATS-friendly resume tailored for you.
            </p>

            <button className="resume-btn-pro" onClick={() => setShowForm(true)}>
              Build Resume
            </button>
          </div>

          {/* Right mini preview */}
          <div className="resume-preview-mini">
            <div className="mini-card">
              <div className="mini-line-top"></div>
              <div className="mini-line short"></div>
              <div className="mini-line"></div>
              <div className="mini-line mid"></div>
              <div className="mini-line"></div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- STEP 2 — FORM ------------------- */}
      {showForm && !generatedResume && (
        <div className="resume-form-container">
          <h3 className="resume-form-title">Enter your details</h3>

          <div className="resume-form-grid">
            <input
              className="resume-input"
              placeholder="Project 1"
              value={project1}
              onChange={(e) => setProject1(e.target.value)}
            />

            <input
              className="resume-input"
              placeholder="Project 2"
              value={project2}
              onChange={(e) => setProject2(e.target.value)}
            />

            <input
              className="resume-input"
              placeholder="Project 3"
              value={project3}
              onChange={(e) => setProject3(e.target.value)}
            />

            <input
              className="resume-input"
              placeholder="Degree (e.g., B.Tech CSE AI)"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />

            <input
              className="resume-input"
              placeholder="Years (e.g., 2023–2027)"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          <button className="resume-btn" onClick={generateResume}>
            Generate Resume
          </button>
        </div>
      )}

      {/* ------------------- STEP 3 — OUTPUT ------------------- */}
      {generatedResume && (
  <div className="resume-output-container">
    <h3 className="resume-output-title">📄 Your Smart Resume</h3>

    <div className="resume-output-box">
      <pre className="resume-output-text">{generatedResume}</pre>
    </div>

    <button className="resume-btn-pro" onClick={downloadPDF}>
      Download as PDF
    </button>
  </div>
)}

    </section>
  );
}
