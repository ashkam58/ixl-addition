import React from "react";

export default function PictureAdditionEngine({ data }) {
    // data: { groups: [2, 3], icon: "🍎" }
    const { groups = [], icon = "🍎" } = data;

    return (
        <div className="picture-addition-container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            fontSize: "3rem"
        }}>
            {groups.map((count, groupIndex) => (
                <React.Fragment key={groupIndex}>
                    <div className="icon-group" style={{
                        display: "grid",
                        gridTemplateColumns: count > 4 ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                        gap: "5px",
                        padding: "10px",
                        background: "rgba(255,255,255,0.5)",
                        borderRadius: "12px",
                        border: "2px dashed #cbd5e1"
                    }}>
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="icon-item" style={{
                                animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                                animationDelay: `${(groupIndex * 5 + i) * 0.1}s`,
                                opacity: 0,
                                transform: "scale(0)"
                            }}>
                                {icon}
                            </div>
                        ))}
                    </div>
                    {groupIndex < groups.length - 1 && (
                        <div style={{ fontSize: "4rem", color: "#94a3b8", fontWeight: "bold" }}>+</div>
                    )}
                </React.Fragment>
            ))}
            <style>{`
        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
