import React from "react";

function CubeStrip({ counts = [], icon }) {
  const palette = ["#3b82f6", "#f97316", "#10b981", "#6366f1"];
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
      {counts.map((cnt, idx) => (
        <div key={`${cnt}-${idx}`} style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: cnt }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: palette[(idx + i) % palette.length],
                boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      ))}
      {icon && !counts?.length && (
        <div style={{ fontSize: "2.4rem" }}>{icon}</div>
      )}
    </div>
  );
}

function PictureGroup({ model }) {
  const { groups = [], icon = "★" } = model || {};
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
            <span key={i} style={{ fontSize: "1.6rem", textAlign: "center" }}>
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
  if (model.trains) return <CubeStrip counts={model.trains} />;
  if (model.groups) return <PictureGroup model={model} />;
  return (
    <div
      style={{
        padding: "12px 16px",
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

export default function ModelMatchEngine({ data, onAnswer }) {
  const {
    promptType = "model_to_sentence",
    sentence,
    model,
    options = [],
    questionText,
  } = data || {};

  const title =
    questionText ||
    (promptType === "sentence_to_model"
      ? "Choose the model that matches the sentence."
      : "Choose the sentence that matches the model.");

  const handleClick = (val) => {
    if (onAnswer) onAnswer(val);
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        justifyItems: "center",
        width: "100%",
      }}
    >
      <div style={{ fontSize: "1.1rem", color: "#475569", fontWeight: 700 }}>
        {title}
      </div>

      {promptType === "model_to_sentence" && renderModel(model)}
      {promptType === "sentence_to_model" && (
        <div
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            padding: "8px 14px",
            background: "#eef2ff",
            borderRadius: "12px",
            border: "2px solid #c7d2fe",
          }}
        >
          {sentence}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          width: "100%",
        }}
      >
        {options.map((opt, idx) => {
          const value = opt.value ?? opt.label ?? opt.id ?? idx;
          const isModel = promptType === "sentence_to_model";
          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              style={{
                border: "2px solid #e2e8f0",
                background: "#fff",
                borderRadius: "14px",
                padding: "14px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
                transition: "all 0.16s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  marginBottom: "6px",
                  fontWeight: 700,
                }}
              >
                {opt.label || String.fromCharCode(65 + idx)}
              </div>
              {isModel ? renderModel(opt.model) : (
                <div style={{ fontSize: "1.4rem", color: "#0f172a", fontWeight: 800 }}>
                  {opt.sentence || opt.text || opt.value || opt.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
