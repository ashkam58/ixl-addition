import React from "react";

function TensOnesCard({ number }) {
  const tens = Math.floor(number / 10);
  const ones = number % 10;
  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "2px solid #e2e8f0",
        background: "#fff",
        display: "grid",
        gap: "6px",
        minWidth: "140px",
      }}
    >
      <div style={{ fontWeight: 800, color: "#0f172a" }}>{number}</div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            padding: "6px 10px",
            borderRadius: "10px",
            background: "#eef2ff",
            color: "#4f46e5",
            fontWeight: 800,
          }}
        >
          {tens} tens
        </div>
        <div
          style={{
            padding: "6px 10px",
            borderRadius: "10px",
            background: "#ecfeff",
            color: "#0ea5e9",
            fontWeight: 800,
          }}
        >
          {ones} ones
        </div>
      </div>
    </div>
  );
}

function HundredChart({ start = 1, end = 100, highlight }) {
  const cells = [];
  for (let i = start; i <= end; i++) {
    cells.push(i);
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gap: "6px",
        maxWidth: "360px",
      }}
    >
      {cells.map((n) => (
        <div
          key={n}
          style={{
            padding: "8px 0",
            textAlign: "center",
            borderRadius: "8px",
            background: highlight === n ? "#fef3c7" : "#f8fafc",
            border: `2px solid ${highlight === n ? "#f59e0b" : "#e2e8f0"}`,
            fontWeight: 700,
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

function VerticalAdd({ numbers = [], regrouping }) {
  const [top, bottom] = numbers;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return (
    <div
      style={{
        borderRadius: "14px",
        border: "2px solid #e2e8f0",
        background: "#fff",
        padding: "14px",
        display: "inline-block",
      }}
    >
      <div style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 900, textAlign: "right" }}>
        {top}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 900, textAlign: "right" }}>
        + {bottom}
      </div>
      <div style={{ borderTop: "3px solid #e2e8f0", marginTop: "8px", paddingTop: "8px" }} />
      <div style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 900, textAlign: "right" }}>
        ?
      </div>
      {regrouping && (
        <div style={{ color: "#f97316", fontWeight: 700, marginTop: "6px" }}>Remember to regroup!</div>
      )}
    </div>
  );
}

export default function PlaceValueAddEngine({ data }) {
  const { mode = "tens_ones_decompose", numbers = [], regrouping = false, highlight } = data || {};

  if (mode === "hundred_chart") {
    return (
      <div style={{ display: "grid", gap: "12px", justifyItems: "center", width: "100%" }}>
        <HundredChart highlight={highlight} />
      </div>
    );
  }

  if (mode === "two_digit_vertical") {
    return (
      <div style={{ display: "grid", gap: "12px", justifyItems: "center", width: "100%" }}>
        <VerticalAdd numbers={numbers} regrouping={regrouping} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {numbers.map((n, idx) => (
        <TensOnesCard key={`${n}-${idx}`} number={n} />
      ))}
    </div>
  );
}
