import React, { useEffect, useState } from "react";
import Game from "./components/game/Game.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AdModal from "./components/AdModal.jsx";
import SubscriptionDashboard from "./components/SubscriptionDashboard.jsx";
import LoginModal from "./components/LoginModal.jsx";
import { skills as mathSkills } from "./data/skillsConfig.js";

const subjects = [
  { id: "math", label: "Math" },
  { id: "ela", label: "English Language Arts" },
  { id: "science", label: "Science" },
  { id: "social", label: "Social Studies" },
  { id: "spanish", label: "Spanish" },
  { id: "spanishla", label: "Spanish Language Arts" },
];

const labsBySubject = {
  math: [
    { id: "addition", label: "Addition", skillsRef: "math_addition", blurb: "Add whole numbers, decimals, fractions, and integers.", count: "495 skills" },
    { id: "algebra", label: "Algebra", blurb: "Equations, inequalities, functions, matrices, expressions.", count: "677 skills" },
    { id: "comparing", label: "Comparing", blurb: "Order numbers, compare fractions, decimals, and large numbers.", count: "262 skills" },
    { id: "counting", label: "Counting", blurb: "Early counting, skip-counting, hundred chart, forward/backward.", count: "298 skills" },
    { id: "decimals", label: "Decimals", blurb: "Place value, operations, powers of ten, conversions.", count: "210 skills" },
    { id: "division", label: "Division", blurb: "Facts, multi-digit division, remainders, decimal quotients.", count: "203 skills" },
    { id: "estimation", label: "Estimation", blurb: "Estimate sums, differences, products, quotients, percents.", count: "101 skills" },
    { id: "exponents", label: "Exponents & Roots", blurb: "Powers, radicals, logarithms, properties.", count: "203 skills" },
    { id: "factfluency", label: "Fact Fluency", blurb: "Core addition, subtraction, multiplication facts.", count: "166 skills" },
    { id: "fractions", label: "Fractions", blurb: "Equivalent fractions, operations, mixed numbers, complex fractions.", count: "434 skills" },
    { id: "functions", label: "Functions & Equations", blurb: "Evaluate, graph, proportional relationships, solving.", count: "658 skills" },
    { id: "geometry", label: "Geometry & Spatial", blurb: "Area, perimeter, angles, similarity, transformations.", count: "869 skills" },
    { id: "graphs", label: "Graphs", blurb: "Tables, plots, histograms, best-fit lines, circle graphs.", count: "435 skills" },
    { id: "integers", label: "Integers", blurb: "Add, subtract, multiply, divide integers; equations.", count: "77 skills" },
    { id: "logic", label: "Logic & Reasoning", blurb: "Puzzles, conditionals, guess-and-check, number construction.", count: "44 skills" },
    { id: "measurement", label: "Measurement", blurb: "Units, conversions, length/area/volume, metric/customary.", count: "156 skills" },
    { id: "mixedops", label: "Mixed Operations", blurb: "Choose the operation, multi-step arithmetic, word problems.", count: "313 skills" },
    { id: "money", label: "Money & Consumer Math", blurb: "Equivalent amounts, add/subtract money, tips, purchases.", count: "141 skills" },
    { id: "multiplication", label: "Multiplication", blurb: "Equal groups, multi-digit, fractions/decimals, powers of ten.", count: "309 skills" },
    { id: "numbertheory", label: "Number Theory", blurb: "Factors, primes, classify numbers, rational/irrational.", count: "68 skills" },
    { id: "patterns", label: "Patterns", blurb: "Numeric patterns, sequences, evaluate expressions for sequences.", count: "135 skills" },
    { id: "percents", label: "Percents", blurb: "Percent of number, tax/discount, original price, percent error.", count: "69 skills" },
    { id: "placevalue", label: "Place Values", blurb: "Digit names, word problems, conversions, decimals.", count: "91 skills" },
    { id: "probability", label: "Probability & Statistics", blurb: "Simple probability, mean/median/mode, outcomes, word problems.", count: "229 skills" },
    { id: "properties", label: "Properties", blurb: "Addition/multiplication/division properties, distributive, matrices.", count: "101 skills" },
    { id: "ratios", label: "Ratios & Proportions", blurb: "Compare ratios, solve proportions, scale drawings.", count: "110 skills" },
    { id: "subtraction", label: "Subtraction", blurb: "Whole, decimal, fraction subtraction, integers.", count: "393 skills" },
    { id: "time", label: "Time", blurb: "Time units, add/subtract time, elapsed time problems.", count: "52 skills" },
    { id: "trigonometry", label: "Trigonometry", blurb: "Pythagorean theorem, trig ratios, laws of sines/cosines.", count: "116 skills" },
    { id: "wordproblems", label: "Word Problems", blurb: "Operation-focused story problems across grades.", count: "611 skills" },
  ],
  ela: [{ id: "reading", label: "Reading Lab (coming soon)" }],
  science: [{ id: "science_core", label: "Science Lab (coming soon)" }],
  social: [{ id: "social_core", label: "Social Studies Lab (coming soon)" }],
  spanish: [{ id: "spanish_core", label: "Spanish Lab (coming soon)" }],
  spanishla: [{ id: "spanishla_core", label: "Spanish LA Lab (coming soon)" }],
};

const skillsLookup = {
  math_addition: mathSkills,
};

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
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [selectedLab, setSelectedLab] = useState("addition");
  const [selectedGrade, setSelectedGrade] = useState("4");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showProModal, setShowProModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [planName, setPlanName] = useState("Free Plan");

  useEffect(() => {
    const storedName = localStorage.getItem("additionLabUser");
    const storedId = localStorage.getItem("additionLabUserId");
    const storedSub = localStorage.getItem("additionLabUserSub");
    if (storedName) {
      setUserName(storedName);
    }
    if (storedId) {
      setUserId(storedId);
    }
    if (storedSub) {
      setIsSubscribed(storedSub === "true");
    }

    // Check for Stripe success/cancel params
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Subscription successful! You are now a Pro member. 🎉");
      setIsSubscribed(true);
      localStorage.setItem("additionLabUserSub", "true");

      // Persist to backend
      const uid = localStorage.getItem("additionLabUserId");
      if (uid) {
        fetch(`https://ixl-addition.onrender.com/api/users/${uid}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "pro" }),
        }).catch(err => console.error("Failed to persist sub", err));
      }

      // Clean up URL
      window.history.replaceState({}, document.title, "/");
      setShowDashboard(true); // Show dashboard on success
    }
    if (query.get("canceled")) {
      alert("Subscription canceled. Maybe next time!");
      // Clean up URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem("additionLabUser", nameInput.trim());
    }
  };

  // Ensure user exists in backend
  useEffect(() => {
    async function ensureUser() {
      try {
        const res = await fetch("https://ixl-addition.onrender.com/api/users/upsert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: userName || "Guest" }),
        });
        const data = await res.json();
        if (data?.user?._id) {
          setUserId(data.user._id);
          setIsSubscribed(Boolean(data.user.subscribed));
          localStorage.setItem("additionLabUserId", data.user._id);
          localStorage.setItem("additionLabUser", data.user.name);
          localStorage.setItem("additionLabUserSub", String(Boolean(data.user.subscribed)));
          setUserName(data.user.name);
          setPlanName(data.user.plan === 'pro' ? 'Pro Plan' : 'Free Plan');
        }
      } catch (err) {
        console.warn("User sync failed", err);
      }
    }
    ensureUser();
  }, [userName]);

  const currentLabConfig =
    labsBySubject[selectedSubject]?.find((l) => l.id === selectedLab) || null;

  const skillMap =
    currentLabConfig && currentLabConfig.skillsRef
      ? skillsLookup[currentLabConfig.skillsRef]
      : {};
  const activeSkills = skillMap[selectedGrade] || [];

  useEffect(() => {
    if (activeSkills.length > 0) {
      setSelectedSkillId(activeSkills[0].id);
    } else {
      setSelectedSkillId("");
    }
  }, [selectedGrade, selectedLab, selectedSubject]);

  const selectedSkill =
    activeSkills.find((s) => s.id === selectedSkillId) || activeSkills[0];

  // Trigger ad every 2 minutes for demo purposes (usually less frequent)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAd(true);
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSkillChange = (e) => {
    const skillId = e.target.value;
    const skill = activeSkills.find((s) => s.id === skillId);

    if (skill && skill.isPremium && !isSubscribed) {
      setShowProModal(true);
    } else {
      setSelectedSkillId(skillId);
    }
  };

  const handleUpgrade = async () => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await fetch(`https://ixl-addition.onrender.com/api/users/${userId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      if (data?.user) {
        setIsSubscribed(true);
        localStorage.setItem("additionLabUserSub", "true");
        setShowProModal(false);
      }
    } catch (err) {
      console.warn("Upgrade failed", err);
    }
  };

  const handleLogin = async (name, email) => {
    try {
      const res = await fetch("https://ixl-addition.onrender.com/api/users/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data?.user) {
        setUserId(data.user._id);
        setUserName(data.user.name);
        setIsSubscribed(Boolean(data.user.subscribed));
        setPlanName(data.user.plan === 'pro' ? 'Pro Plan' : 'Free Plan');

        localStorage.setItem("additionLabUserId", data.user._id);
        localStorage.setItem("additionLabUser", data.user.name);
        localStorage.setItem("additionLabUserSub", String(Boolean(data.user.subscribed)));
      }
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const [showDashboard, setShowDashboard] = useState(false);

  const handleNavButtonClick = () => {
    if (isSubscribed) {
      setShowDashboard(true);
    } else {
      setShowAd(true);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-icon">+</div>
            <div>
              <div className="brand-title">Learning Labs</div>
              <div className="brand-sub">
                <button className="login-link-btn" onClick={() => setShowLoginModal(true)}>
                  {userId ? `Hi, ${userName}! (Switch)` : "Login / Sign Up"}
                </button>
              </div>
            </div>
          </div>

          <button
            className={`pro-pill ${isSubscribed ? "pro-active" : ""}`}
            onClick={handleNavButtonClick}
          >
            {isSubscribed ? "MY DASHBOARD 👑" : "Upgrade to Pro"}
          </button>

          <div className="grade-badge">
            Grade: {grades.find((g) => g.id === selectedGrade)?.label || selectedGrade}
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <span className="control-label">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedSubject(next);
                const firstLab = labsBySubject[next]?.[0];
                if (firstLab) setSelectedLab(firstLab.id);
              }}
              className="pill-select"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <span className="control-label">Lab:</span>
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="pill-select"
            >
              {(labsBySubject[selectedSubject] || []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label} {l.count ? `(${l.count})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <span className="control-label">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="pill-select"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group" style={{ flex: 1 }}>
            <span className="control-label">Skill:</span>
            {activeSkills.length > 0 ? (
              <select
                value={selectedSkillId}
                onChange={handleSkillChange}
                className="pill-select"
              >
                {activeSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} {s.isPremium && !isSubscribed ? "(PRO)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ color: "var(--accent-contrast)", opacity: 0.85 }}>
                No skills for this selection yet.
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="game-panel">
          {currentLabConfig && (
            <div style={{ marginBottom: "12px", color: "#1e1b2d", fontWeight: 700 }}>
              {currentLabConfig.label} {currentLabConfig.count ? `• ${currentLabConfig.count}` : ""}{" "}
              {currentLabConfig.blurb ? `• ${currentLabConfig.blurb}` : ""}
            </div>
          )}
          <ErrorBoundary>
            {currentLabConfig?.skillsRef ? (
              selectedSkill ? (
                <Game selectedSkill={selectedSkill} userId={userId || userName || "guest"} />
              ) : (
                <div>Please select a grade and skill.</div>
              )
            ) : (
              <div>This lab is coming soon for this subject.</div>
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
              This skill is part of the Pro plan. Upgrade to unlock all labs, skills, and unlimited practice!
            </p>
            <button className="modal-btn" onClick={handleUpgrade}>Get Pro Plan</button>
            <button className="modal-close" onClick={() => setShowProModal(false)}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {showAd && <AdModal onClose={() => setShowAd(false)} />}

      {showDashboard && (
        <SubscriptionDashboard
          isSubscribed={isSubscribed}
          userName={userName}
          planName={planName}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

// Add simple style for login link
const style = document.createElement('style');
style.textContent = `
  .login-link-btn {
    background: none;
    border: none;
    color: white;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    opacity: 0.9;
  }
  .login-link-btn:hover {
    opacity: 1;
  }
`;
document.head.appendChild(style);



