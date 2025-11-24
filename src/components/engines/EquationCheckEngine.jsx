import React from "react";

export default function EquationCheckEngine({ data, onAnswer }) {
  const { mode = "choose_sign", left = "", right = "", options = [], statements = [] } = data || {};

  if (mode === "true_false") {
    const statement = statements[0] || left;
    return (
      <div
        style={{
          display: "grid",
          gap: "12px",
          justifyItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: 900,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          {statement}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {["True", "False"].map((label) => (
            <button
              key={label}
              onClick={() => onAnswer && onAnswer(label.toLowerCase())}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                fontSize: "1.1rem",
                cursor: "pointer",
                minWidth: "110px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

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
          fontSize: "2.2rem",
          fontWeight: 900,
          color: "#0f172a",
          textAlign: "center",
        }}
      >
        {left.replace("__", "___")} {right !== undefined && right !== "" ? `= ${right}` : ""}
      </div>

      {options.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
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
                padding: "12px 0",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                fontSize: "1.4rem",
                cursor: "pointer",
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
