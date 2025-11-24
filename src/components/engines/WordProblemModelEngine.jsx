import React from "react";

function CubeStrip({ trains = [] }) {
  const palette = ["#0ea5e9", "#10b981", "#f97316", "#6366f1"];
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
      {trains.map((cnt, idx) => (
        <div key={`${cnt}-${idx}`} style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: cnt }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "8px",
                background: palette[(idx + i) % palette.length],
                boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PictureGroup({ model }) {
  const { groups = [], icon = "★" } = model || {};
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
      {groups.map((count, idx) => (
        <div
          key={`${count}-${idx}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "6px",
            padding: "8px",
            borderRadius: "10px",
            background: "rgba(148,163,184,0.12)",
            border: "2px dashed #cbd5e1",
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.4rem", textAlign: "center" }}>
              {icon}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function renderModel(model) {
  if (!model) return null;
  if (model.type === "cubes" || model.trains) return <CubeStrip trains={model.trains || model.addends || []} />;
  if (model.type === "picture" || model.groups) return <PictureGroup model={model} />;
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: "12px",
        background: "#f8fafc",
        border: "2px solid #e2e8f0",
        fontWeight: 700,
      }}
    >
      {JSON.stringify(model)}
    </div>
  );
}

export default function WordProblemModelEngine({ data, onAnswer }) {
  const { story = "", model, question = "Solve the problem.", options = [] } = data || {};

  return (
    <div
      style={{
        display: "grid",
        gap: "14px",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "14px",
          borderRadius: "14px",
          border: "2px solid #e2e8f0",
          background: "#f8fafc",
          color: "#0f172a",
          lineHeight: 1.5,
          fontWeight: 600,
        }}
      >
        {story}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>{renderModel(model)}</div>
      <div style={{ fontWeight: 800, color: "#334155" }}>{question}</div>

      {options.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
          }}
        >
          {options.map((opt, idx) => (
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
