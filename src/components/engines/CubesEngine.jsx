import React from "react";

export default function CubesEngine({ data }) {
    const { addends } = data;

    // Define some fun colors for the rows
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

    return (
        <div className="cubes-engine" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
            {addends.map((count, rowIndex) => (
                <div key={rowIndex} className="cube-row" style={{ display: "flex", gap: "8px" }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="cube"
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: colors[rowIndex % colors.length],
                                borderRadius: "8px",
                                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                                border: "2px solid rgba(255,255,255,0.4)",
                                animation: `popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                                animationDelay: `${(rowIndex * 5 + i) * 0.05}s`,
                                opacity: 0,
                                transform: "scale(0)",
                            }}
                        />
                    ))}
                </div>
            ))}
            <style>{`
        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
