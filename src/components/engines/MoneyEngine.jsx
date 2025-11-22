import React from "react";

function MoneyItem({ label, value, count }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#f8fafc",
        padding: "10px 12px",
        borderRadius: "12px",
        border: "2px solid #e2e8f0",
        minWidth: "200px",
        boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#0ea5e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "800",
          fontSize: "14px",
          boxShadow: "0 3px 0 #0369a1"
        }}
      >
        {value >= 1 ? `$${value.toFixed(0)}` : `${Math.round(value * 100)}¢`}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "800", color: "#0f172a" }}>{label}</div>
        <div style={{ color: "#475569", fontSize: "13px" }}>Count: {count}</div>
      </div>
    </div>
  );
}

export default function MoneyEngine({ data }) {
  const { items = [] } = data;
  const total = items.reduce((sum, it) => sum + it.value * it.count, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        {items.map((it, idx) => (
          <MoneyItem key={idx} {...it} />
        ))}
      </div>
      <div style={{ marginTop: "8px", fontWeight: "800", color: "#0f172a" }}>
        Total shown: ${total.toFixed(2)}
      </div>
    </div>
  );
}
