import React from "react";

export default function WordProblemSentenceEngine({ data, onAnswer }) {
  const { story = "", template = "__ + __ = __", options = [] } = data || {};

  const renderTemplate = () =>
    template.split("__").map((part, idx) => (
      <React.Fragment key={idx}>
        <span style={{ whiteSpace: "pre-wrap" }}>{part}</span>
        {idx !== template.split("__").length - 1 && (
          <span
            style={{
              minWidth: "48px",
              height: "40px",
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
        )}
      </React.Fragment>
    ));

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

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 900,
          color: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {renderTemplate()}
      </div>

      {options.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
