import React, { useState, useEffect, useCallback } from "react";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCommutativeProblem() {
  // You can tweak ranges for different grades
  const a = randomInt(10, 999);
  const b = randomInt(10, 999);
  const op = Math.random() < 0.5 ? "+" : "×"; // addition or multiplication

  const original = `${a} ${op} ${b}`;
  const transformed = `${b} ${op} ${a}`;

  return {
    a,
    b,
    op,
    original,
    transformed
  };
}

export default function CommutativeEngine() {
  const [problem, setProblem] = useState(() => generateCommutativeProblem());
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState(null); // "correct" | "incorrect" | null
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [questionsDone, setQuestionsDone] = useState(0);

  const normalizeExpr = (str = "") =>
    str.replace(/\s+/g, "").trim(); // remove all spaces

  const handleNewQuestion = useCallback(() => {
    setProblem(generateCommutativeProblem());
    setAnswer("");
    setStatus(null);
    setMessage("");
  }, []);

  const handleCheck = () => {
    if (!answer.trim()) {
      setStatus(null);
      setMessage("Type the new expression before checking!");
      return;
    }

    const correct = normalizeExpr(problem.transformed);
    const user = normalizeExpr(answer);
    const originalNorm = normalizeExpr(problem.original);

    let isCorrect = false;

    if (user === correct) {
      isCorrect = true;
    } else if (user === originalNorm) {
      // They just repeated the original expression
      isCorrect = false;
      setMessage("You kept the order the same. Try swapping the numbers!");
    }

    if (isCorrect) {
      setStatus("correct");
      setMessage("Perfect! You used the commutative property. 🎉");
      setStreak((s) => s + 1);
      setQuestionsDone((q) => q + 1);
    } else if (user !== originalNorm) {
      setStatus("incorrect");
      setMessage(
        "Not quite. Swap the positions of the two numbers, but keep the same sign."
      );
      setStreak(0);
      setQuestionsDone((q) => q + 1);
    }
  };

  // Small "confetti" burst with emojis when correct (visual only)
  useEffect(() => {
    if (status !== "correct") return;
    const el = document.createElement("div");
    el.textContent = "🎉🎉🎉";
    el.style.position = "fixed";
    el.style.top = "10%";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.fontSize = "32px";
    el.style.pointerEvents = "none";
    el.style.animation =
      "comm-confetti 900ms ease-out forwards";

    document.body.appendChild(el);

    const timer = setTimeout(() => {
      document.body.removeChild(el);
    }, 900);

    return () => clearTimeout(timer);
  }, [status]);

  const borderColor =
    status === "correct"
      ? "#22c55e"
      : status === "incorrect"
      ? "#f97316"
      : "#e2e8f0";

  return (
    <>
      {/* Tiny keyframes for the emoji “confetti” */}
      <style>{`
        @keyframes comm-confetti {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          20% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 50px); }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff, #fefce8)",
          padding: "20px",
          borderRadius: "24px",
          maxWidth: "560px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
          border: `2px solid ${borderColor}`,
          margin: "0 auto",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 800,
            color: "#0369a1",
            marginBottom: "4px"
          }}
        >
          Commutative Property Practice
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#0f172a"
          }}
        >
          Rewrite using the commutative property.
        </div>

        {/* Problem display */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "18px",
            background: "white",
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#475569",
              background: "#e0f2fe",
              padding: "4px 10px",
              borderRadius: "999px"
            }}
          >
            Original:
          </span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "1px"
            }}
          >
            {problem.original}
          </span>
        </div>

        {/* Instruction */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#475569"
          }}
        >
          Swap the numbers, keep the same sign, and type the new expression.
          <br />
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            (Example: <strong>3 + 7</strong> becomes <strong>7 + 3</strong>)
          </span>
        </div>

        {/* Answer input + Check */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            gap: "8px",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setStatus(null);
              setMessage("");
            }}
            placeholder="Type the new expression..."
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "999px",
              border: "1px solid #c4d4f5",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <button
            type="button"
            onClick={handleCheck}
            style={{
              padding: "9px 16px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(34,197,94,0.45)"
            }}
          >
            Check
          </button>
        </div>

        {/* Feedback */}
        {message && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "13px",
              color: status === "correct" ? "#16a34a" : "#f97316",
              minHeight: "18px"
            }}
          >
            {message}
          </div>
        )}

        {/* Controls & Stats */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#64748b"
          }}
        >
          <button
            type="button"
            onClick={handleNewQuestion}
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              border: "1px dashed #94a3b8",
              background: "white",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            New Question ↻
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            <span>
              🔥 Streak:{" "}
              <strong style={{ color: "#0f172a" }}>{streak}</strong>
            </span>
            <span>
              ✅ Tried:{" "}
              <strong style={{ color: "#0f172a" }}>{questionsDone}</strong>
            </span>
          </div>
        </div>

        {/* Mini hint */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "12px",
            color: "#6b7280",
            background: "#ecfeff",
            borderRadius: "12px",
            padding: "6px 10px",
            textAlign: "left"
          }}
        >
          💡 <strong>Commutative Property:</strong> You can change the order of
          the numbers when you add or multiply. The result stays the same.
        </div>
      </div>
    </>
  );
}
