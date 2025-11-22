import React from "react";

export default function EquationEngine({ data }) {
    // data: { equation: "3 + ? = 8", parts: ["3", "+", "?", "=", "8"] }
    // If 'parts' is provided, we can render it more nicely.
    // Otherwise we just render the equation text, but that's less interactive if we want the input IN the equation.

    // For this MVP, let's assume the Game.jsx handles the input separately below the engine.
    // So this engine just visualizes the problem.
    // However, to make it "production ready" and cool, the input should ideally be inline if possible.
    // But Game.jsx controls `userAnswer`. 
    // Let's render the equation with a placeholder box for the missing part.

    const { equation = "" } = data;

    // Simple parser to find '?' and replace with a visual box
    const parts = equation.split(/(\?)/g);

    return (
        <div className="equation-engine-container" style={{
            fontSize: "3rem",
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap"
        }}>
            {parts.map((part, index) => {
                if (part === "?") {
                    return (
                        <div key={index} style={{
                            width: "60px",
                            height: "60px",
                            border: "3px dashed #94a3b8",
                            borderRadius: "8px",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#cbd5e1"
                        }}>
                            ?
                        </div>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
}
