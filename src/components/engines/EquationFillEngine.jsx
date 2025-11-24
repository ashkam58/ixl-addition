import React from "react";

function renderParts(template = "") {
  const segments = template.split("__");
  const result = [];
  segments.forEach((seg, idx) => {
    result.push(
      <span key={`seg-${idx}`} style={{ whiteSpace: "pre-wrap" }}>
        {seg}
      </span>
    );
    if (idx !== segments.length - 1) {
      result.push(
        <span
          key={`blank-${idx}`}
          style={{
            minWidth: "52px",
            height: "44px",
            border: "3px dashed #cbd5e1",
            background: "#f8fafc",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            margin: "0 4px",
            fontWeight: 800,
            color: "#94a3b8",
          }}
        >
          ?
        </span>
      );
    }
  });
  return result;
}

export default function EquationFillEngine({ data, onAnswer }) {
  const { template = "__ + __ = __", options = [], strategy, hint } = data || {};

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        justifyItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {renderParts(template)}
      </div>

      {hint && (
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
          Strategy: {hint || strategy}
        </div>
      )}

      {options.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {options.map((opt, idx) => (
            <button
              key={`${opt}-${idx}`}
              onClick={() => onAnswer && onAnswer(String(opt))}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                minWidth: "64px",
                boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
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
