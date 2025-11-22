import React, { useEffect, useState } from "react";

export default function Confetti() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate particles
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
        const newParticles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: 50, // Start at center
            y: 50, // Start at center
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * 360,
            velocity: 5 + Math.random() * 10,
            size: 5 + Math.random() * 10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 20,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        borderRadius: "2px",
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `explode-${p.id} 1s ease-out forwards`,
                    }}
                />
            ))}
            <style>
                {particles.map((p) => `
          @keyframes explode-${p.id} {
            0% {
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) rotate(0deg);
              opacity: 1;
            }
            100% {
              left: ${50 + Math.cos((p.angle * Math.PI) / 180) * p.velocity * 4}%;
              top: ${50 + Math.sin((p.angle * Math.PI) / 180) * p.velocity * 4}%;
              transform: translate(-50%, -50%) rotate(${p.rotation + 360}deg);
              opacity: 0;
            }
          }
        `).join("")}
            </style>
        </div>
    );
}
