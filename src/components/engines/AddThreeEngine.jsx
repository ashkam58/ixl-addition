import React from "react";

export default function AddThreeEngine({ data, onAnswer }) {
  const { numbers = [], strategy } = data || {};
  const title = numbers.join(" + ");

  return (
    <div
      style={{
        display: "grid",
        gap: "10px",
        justifyItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {title} = ?
      </div>

      {strategy && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            background: "#ecfeff",
            color: "#0ea5e9",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Strategy: {strategy}
        </div>
      )}

      {data?.options?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            width: "100%",
          }}
        >
          {data.options.map((opt, idx) => (
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
