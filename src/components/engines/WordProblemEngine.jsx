import React from "react";

export default function WordProblemEngine({ data, onAnswer }) {
  const { story = "", question = "What is the answer?", options = [] } = data || {};

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "14px",
          borderRadius: "14px",
          border: "2px solid #e2e8f0",
          background: "#f8fafc",
          color: "#0f172a",
          lineHeight: 1.5,
          fontWeight: 600,
        }}
      >
        {story}
      </div>
      <div style={{ fontWeight: 800, color: "#334155" }}>{question}</div>

      {options.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
          }}
        >
          {options.map((opt, idx) => (
            <button
              key={`${opt}-${idx}`}
              onClick={() => onAnswer && onAnswer(String(opt))}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
