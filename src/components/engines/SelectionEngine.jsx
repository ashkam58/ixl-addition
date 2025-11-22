import React from "react";

export default function SelectionEngine({ data, onAnswer }) {
    // data: { options: [{ label: "A", value: 5, content: "..." }, ...], type: "text" | "image" }
    // onAnswer: callback to set the answer when clicked
    const { options = [] } = data;

    return (
        <div className="selection-engine-container" style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            width: "100%"
        }}>
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onAnswer && onAnswer(option.value)}
                    className="selection-option"
                    style={{
                        background: "white",
                        border: "3px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "20px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: "120px"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {option.image ? (
                        <div style={{ fontSize: "3rem" }}>{option.image}</div>
                    ) : (
                        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#334155" }}>{option.content || option.value}</div>
                    )}
                    <div style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                    }}>
                        {String.fromCharCode(65 + index)}
                    </div>
                </button>
            ))}
        </div>
    );
}
