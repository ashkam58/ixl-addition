import React from "react";

export default function VerticalAdditionEngine({ data }) {
    // data: { operands: [123, 456] }
    const { operands = [] } = data;

    // Find the maximum number of digits to align columns
    const maxDigits = Math.max(...operands.map(n => String(n).length));

    // We don't handle the input here, Game.jsx handles the main answer input.
    // This component just visualizes the vertical stack.

    return (
        <div className="vertical-addition-container" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#334155"
        }}>
            <div style={{ display: "inline-block", textAlign: "right" }}>
                {operands.map((op, index) => (
                    <div key={index} style={{
                        position: "relative",
                        paddingRight: "10px" // Space for operator
                    }}>
                        {index === operands.length - 1 && (
                            <span style={{
                                position: "absolute",
                                left: "-40px",
                                top: "0"
                            }}>+</span>
                        )}
                        {op}
                    </div>
                ))}
                <div style={{
                    height: "4px",
                    background: "#334155",
                    width: "100%",
                    marginTop: "8px",
                    marginBottom: "8px",
                    borderRadius: "2px"
                }}></div>

                {/* The answer input is handled by Game.jsx, but we can show a placeholder or question mark? 
            Actually, Game.jsx renders the input *below* the engine usually.
            To make it look integrated, we might want to render the input HERE.
            But Game.jsx controls the state `userAnswer`.
            
            If we want the input to be *inside* this stack, we need to accept `userAnswer` and `onAnswerChange` props.
            Let's assume Game.jsx passes them if we ask, OR we just let Game.jsx render the input below.
            
            For now, let's let Game.jsx render the input below. It's safer.
            We just render the stack.
        */}
                <div style={{
                    color: "#cbd5e1",
                    textAlign: "right",
                    paddingRight: "10px"
                }}>
                    ?
                </div>
            </div>
        </div>
    );
}
