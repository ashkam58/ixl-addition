import React from "react";

function TenFrame({ filled }) {
  const cells = Array.from({ length: 10 }, (_, i) => i < filled);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 32px)",
        gridTemplateRows: "repeat(2, 32px)",
        gap: "4px",
        padding: "8px",
        borderRadius: "12px",
        background: "#fff",
        border: "2px solid #cbd5e1",
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.08)"
      }}
    >
      {cells.map((isFilled, idx) => (
        <div
          key={idx}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "2px solid #e2e8f0",
            background: isFilled ? "#f59e0b" : "#f8fafc",
            boxShadow: isFilled ? "inset 0 2px 4px rgba(0,0,0,0.15)" : "none"
          }}
        />
      ))}
    </div>
  );
}

export default function TenFrameEngine({ data }) {
  const { frames = [] } = data;
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
      {frames.map((count, idx) => (
        <div key={idx} style={{ textAlign: "center" }}>
          <TenFrame filled={count} />
          <div style={{ marginTop: "8px", fontWeight: "700", color: "#334155" }}>{count}</div>
        </div>
      ))}
    </div>
  );
}
