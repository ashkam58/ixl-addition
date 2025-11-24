import React from "react";

function buildFamily(numbers = []) {
  if (numbers.length !== 3) return [];
  const [a, b, c] = [...numbers].sort((x, y) => x - y);
  return [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} - ${a} = ${b}`, `${c} - ${b} = ${a}`];
}

export default function FactFamilyEngine({ data, onAnswer }) {
  const { numbers = [], options, prompt } = data || {};
  const family = options || buildFamily(numbers);

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
          fontSize: "1.2rem",
          color: "#475569",
          fontWeight: 700,
        }}
      >
        {prompt || "Select the fact family sentence that fits these numbers:"}
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 16px",
          background: "#f8fafc",
          border: "2px solid #e2e8f0",
          borderRadius: "12px",
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {numbers.join(" • ")}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "10px",
          width: "100%",
        }}
      >
        {family.map((sentence, idx) => (
          <button
            key={`${sentence}-${idx}`}
            onClick={() => onAnswer && onAnswer(sentence)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              background: "#fff",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
            }}
          >
            {sentence}
          </button>
        ))}
      </div>
    </div>
  );
}
