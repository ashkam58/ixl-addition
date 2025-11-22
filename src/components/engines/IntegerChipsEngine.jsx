import React from "react";

export default function IntegerChipsEngine({ data }) {
    const { addends } = data;

    return (
        <div className="integer-chips-engine">
            <div className="chips-container">
                {addends.map((val, i) => (
                    <div key={i} className="chip-group">
                        <div className="chip-label">{val > 0 ? `+${val}` : val}</div>
                        <div className="chips-grid">
                            {Array.from({ length: Math.abs(val) }).map((_, j) => (
                                <div
                                    key={j}
                                    className={`chip ${val >= 0 ? "chip-pos" : "chip-neg"}`}
                                >
                                    {val >= 0 ? "+" : "-"}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
        .integer-chips-engine {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 20px;
        }
        .chips-container {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          flex-wrap: wrap;
          justify-content: center;
        }
        .chip-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.5);
          padding: 15px;
          border-radius: 16px;
          border: 2px dashed rgba(0, 0, 0, 0.1);
        }
        .chip-label {
          font-size: 24px;
          font-weight: 800;
          color: #475569;
        }
        .chips-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .chip {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 24px;
          color: white;
          box-shadow: 0 4px 0 rgba(0,0,0,0.2);
        }
        .chip-pos {
          background: #facc15; /* Yellow */
          color: #854d0e;
          border: 2px solid #eab308;
        }
        .chip-neg {
          background: #ef4444; /* Red */
          color: white;
          border: 2px solid #b91c1c;
        }
      `}</style>
        </div>
    );
}
