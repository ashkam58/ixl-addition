import React, { useState, useEffect } from "react";

export default function NumberLineEngine({ data, onAnswer }) {
    // data: { start: -10, end: 10, step: 1, operands: [3, -5], answer: -2 }
    const { start = 0, end = 20, step = 1, operands = [] } = data;
    const [selectedValue, setSelectedValue] = useState(null);

    // Calculate range and width
    const range = end - start;
    const width = 800;
    const height = 200;
    const padding = 50;
    const effectiveWidth = width - padding * 2;
    const pixelsPerUnit = effectiveWidth / range;

    // Helper to get X position for a value
    const getX = (val) => padding + (val - start) * pixelsPerUnit;

    // Generate ticks
    const ticks = [];
    for (let i = start; i <= end; i += step) {
        ticks.push(i);
    }

    // Handle click on tick
    const handleTickClick = (val) => {
        setSelectedValue(val);
        // In this engine, clicking the number line *is* the input mechanism.
        // We might want to let the parent know the "userAnswer" is this value.
        // But Game.jsx expects text input usually. 
        // For this specific engine, maybe we update a hidden input or just show the value?
        // Let's assume Game.jsx will read 'userAnswer' from the input field, 
        // so we should probably just display the selected value visually 
        // and maybe auto-fill the input if we could, but Game.jsx controls that state.
        // 
        // Wait, Game.jsx controls `userAnswer`. 
        // To make this interactive, I need to pass `setUserAnswer` down or 
        // Game.jsx needs to handle custom events.
        // 
        // For now, I'll just render the visual. The user still types the answer in the main input.
        // OR, I can dispatch a custom event? No, that's hacky.
        // 
        // Better: The user uses the number line to "work it out", then types the answer.
        // This keeps it consistent with other engines.
    };

    // Generate hops (arcs)
    // We start at 0 (or the first operand? Usually 0 -> op1 -> op1+op2)
    const hops = [];
    let currentPos = 0;

    // If we want to show the problem visually:
    // Hop 1: 0 to Operand1
    // Hop 2: Operand1 to Operand1+Operand2
    operands.forEach((op, index) => {
        const startVal = currentPos;
        const endVal = currentPos + op;

        // Calculate arc path
        const startX = getX(startVal);
        const endX = getX(endVal);
        const dist = Math.abs(endX - startX);
        const arcHeight = Math.min(dist / 2, 80); // Cap height
        const sweep = op > 0 ? 1 : 1; // Always arc up for now? Or down for negative?
        // Let's arc UP for positive, DOWN for negative? Or just different colors.
        // Standard is usually arcs above.

        // SVG Path for Arc: M startX Y Q controlX controlY endX Y
        const midX = (startX + endX) / 2;
        const midY = 100 - arcHeight; // 100 is the baseline Y

        hops.push({
            path: `M ${startX} 100 Q ${midX} ${midY} ${endX} 100`,
            color: index === 0 ? "#3b82f6" : "#ef4444", // Blue then Red
            label: op > 0 ? `+${op}` : `${op}`,
            labelX: midX,
            labelY: midY - 10
        });

        currentPos = endVal;
    });

    return (
        <div className="number-line-container" style={{ width: "100%", overflowX: "auto", textAlign: "center" }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Main Line */}
                <line x1={padding} y1={100} x2={width - padding} y2={100} stroke="#94a3b8" strokeWidth="2" />

                {/* Arrows */}
                <polygon points={`${width - padding + 10},100 ${width - padding},95 ${width - padding},105`} fill="#94a3b8" />
                <polygon points={`${padding - 10},100 ${padding},95 ${padding},105`} fill="#94a3b8" />

                {/* Ticks */}
                {ticks.map((val) => (
                    <g key={val} onClick={() => handleTickClick(val)} style={{ cursor: "pointer" }}>
                        <line
                            x1={getX(val)}
                            y1={90}
                            x2={getX(val)}
                            y2={110}
                            stroke={selectedValue === val ? "#0ea5e9" : "#94a3b8"}
                            strokeWidth={selectedValue === val ? "3" : "2"}
                        />
                        <text
                            x={getX(val)}
                            y={130}
                            textAnchor="middle"
                            fill={selectedValue === val ? "#0ea5e9" : "#64748b"}
                            fontWeight={selectedValue === val ? "bold" : "normal"}
                            fontSize="14"
                        >
                            {val}
                        </text>

                        {/* Invisible hit area for easier clicking */}
                        <rect x={getX(val) - 10} y={80} width={20} height={60} fill="transparent" />
                    </g>
                ))}

                {/* Hops */}
                {hops.map((hop, i) => (
                    <g key={i}>
                        <path d={hop.path} fill="none" stroke={hop.color} strokeWidth="3" strokeLinecap="round" />
                        <text x={hop.labelX} y={hop.labelY} textAnchor="middle" fill={hop.color} fontWeight="bold">
                            {hop.label}
                        </text>
                        {/* Arrowhead for hop */}
                        {/* Complex to calculate exact rotation, skipping for MVP */}
                    </g>
                ))}

                {/* User Selection Marker */}
                {selectedValue !== null && (
                    <circle cx={getX(selectedValue)} cy={100} r={6} fill="#0ea5e9" />
                )}
            </svg>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "-20px" }}>
                Click a number on the line to mark your answer!
            </p>
        </div>
    );
}
