import React from "react";

export default function FactEngine({ data, onAnswer }) {
  const { expression = "3 + 4", options = [], timed = false } = data || {};

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
        justifyItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "1px",
        }}
      >
        {expression} = ?
      </div>
      {timed && (
        <div
          style={{
            fontSize: "0.95rem",
            color: "#f97316",
            fontWeight: 700,
            background: "#fff7ed",
            padding: "6px 12px",
            borderRadius: "999px",
            border: "2px solid #fed7aa",
          }}
        >
          Quick! This one is timed.
        </div>
      )}
      {options.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
            gap: "10px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {options.map((opt, idx) => (
            <button
              key={`${opt}-${idx}`}
              onClick={() => onAnswer && onAnswer(String(opt))}
              style={{
                padding: "14px 0",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                fontSize: "1.2rem",
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
