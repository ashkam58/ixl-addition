import React from "react";

export default function MakeNumberEngine({ data, onAnswer }) {
  const { target = 10, options = [], choiceMode = "select_pairs", prompt } = data || {};

  const title =
    prompt || `Choose the pair that makes ${target}`;

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
          fontSize: "1.2rem",
          color: "#475569",
          fontWeight: 700,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          width: "100%",
        }}
      >
        {options.map((opt, idx) => {
          const left = Array.isArray(opt) ? opt[0] : opt?.a ?? opt.left;
          const right = Array.isArray(opt) ? opt[1] : opt?.b ?? opt.right;
          const label = `${left} + ${right}`;
          const value = `${left}+${right}`;
          const isDisabled =
            choiceMode === "select_pairs" && Number(left) + Number(right) !== target;

          return (
            <button
              key={`${value}-${idx}`}
              onClick={() => onAnswer && onAnswer(value)}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                fontWeight: 800,
                fontSize: "1.2rem",
                cursor: "pointer",
                opacity: isDisabled ? 0.65 : 1,
                boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
