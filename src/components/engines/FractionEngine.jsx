import React from "react";

function FractionBar({ num, den }) {
  const segments = Array.from({ length: den }, (_, i) => i);
  return (
    <div className="fraction-bar">
      <div className="bar">
        {segments.map((i) => (
          <div
            key={i}
            className={i < num ? "segment filled" : "segment"}
          ></div>
        ))}
      </div>
      <div className="label">
        {num}/{den}
      </div>
    </div>
  );
}

export default function FractionEngine({ data }) {
  const { fractions } = data;

  return (
    <div className="fraction-engine">
      <div className="bars-row">
        {fractions.map((f, idx) => (
          <FractionBar key={idx} num={f.num} den={f.den} />
        ))}
      </div>
      <div className="expression">
        {fractions.map((f, idx) => (
          <span key={idx}>
            {idx > 0 && " + "}
            {f.num}/{f.den}
          </span>
        ))}
      </div>
    </div>
  );
}
