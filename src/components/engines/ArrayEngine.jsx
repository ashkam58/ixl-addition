import React from "react";

export default function ArrayEngine({ data }) {
  const { rows = 1, cols = 1, icon = "●", color = "#2563eb" } = data;
  const total = rows * cols;
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 48px)`,
          gap: "10px",
          justifyContent: "center",
          marginBottom: "16px"
        }}
      >
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#eff6ff",
              border: "2px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color
            }}
          >
            {icon}
          </div>
        ))}
      </div>
      <div style={{ fontWeight: "700", color: "#334155" }}>
        Rows: {rows} &nbsp;|&nbsp; Columns: {cols} &nbsp;|&nbsp; Total: {total}
      </div>
    </div>
  );
}
