import React, { useEffect, useState } from "react";
import Game from "./components/game/Game.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { skills } from "./data/skillsConfig.js";

const grades = [
  { id: "PK", label: "Pre-K" },
  { id: "K", label: "Kindergarten" },
  { id: "1", label: "Grade 1" },
  { id: "2", label: "Grade 2" },
  { id: "3", label: "Grade 3" },
  { id: "4", label: "Grade 4" },
  { id: "5", label: "Grade 5" },
  { id: "6", label: "Grade 6" },
  { id: "7", label: "Grade 7" },
  { id: "8", label: "Grade 8" },
  { id: "Alg1", label: "Algebra 1" },
  { id: "Alg2", label: "Algebra 2" },
];

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState("4");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("additionLabUser");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem("additionLabUser", nameInput.trim());
    }
  };

  const availableSkills = skills[selectedGrade] || [];

  useEffect(() => {
    if (availableSkills.length > 0) {
      setSelectedSkillId(availableSkills[0].id);
    } else {
      setSelectedSkillId("");
    }
  }, [selectedGrade]);

  const selectedSkill =
    availableSkills.find((s) => s.id === selectedSkillId) || availableSkills[0];

  const [showProModal, setShowProModal] = useState(false);
  const isSubscribed = false; // Hardcoded for now

  const handleSkillChange = (e) => {
    const skillId = e.target.value;
    const skill = availableSkills.find((s) => s.id === skillId);

    if (skill && skill.isPremium && !isSubscribed) {
      setShowProModal(true);
    } else {
      setSelectedSkillId(skillId);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">
          <span className="logo-emoji">+</span>
          <span className="logo-text">Addition Lab</span>
        </div>

        <div
          className="user-profile-section"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {userName ? (
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Hi, {userName}!
            </span>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                  background: "white",
                  color: "var(--accent-dark)",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grade-selector">
          <span className="grade-label">Grade:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="grade-select"
          >
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>

          {availableSkills.length > 0 && (
            <>
              <span className="grade-label">
                Skill:
              </span>
              <select
                value={selectedSkillId}
                onChange={handleSkillChange}
                className="grade-select"
              >
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} {s.isPremium && !isSubscribed ? "(PRO)" : ""}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <section className="game-panel">
          <ErrorBoundary>
            {selectedSkill ? (
              <Game selectedSkill={selectedSkill} userId={userName || "guest"} />
            ) : (
              <div>Please select a grade and skill.</div>
            )}
          </ErrorBoundary>
        </section>
      </main>

      {showProModal && (
        <div className="modal-overlay" onClick={() => setShowProModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-emoji">⭐</span>
            <h2 className="modal-title">Unlock Pro Skills</h2>
            <p className="modal-text">
              This skill is part of the Pro plan. Upgrade to unlock all grades,
              skills, and unlimited practice!
            </p>
            <button className="modal-btn">Get Pro Plan</button>
            <button className="modal-close" onClick={() => setShowProModal(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
