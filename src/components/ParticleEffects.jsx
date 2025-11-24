import React, { useEffect, useState } from 'react';

export function Confetti({ onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDelay: Math.random() * 0.5,
            color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 6)],
            rotation: Math.random() * 360,
            size: Math.random() * 8 + 4
        }));
        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="confetti-particle"
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: '-20px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        animation: `confettiFall 3s ease-in forwards`,
                        animationDelay: `${p.animationDelay}s`,
                        transform: `rotate(${p.rotation}deg)`,
                        borderRadius: '2px'
                    }}
                />
            ))}
        </div>
    );
}

export function EmojiExplosion({ emoji = '⭐', count = 12, onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * 2 * Math.PI;
            const distance = 100 + Math.random() * 50;
            return {
                id: i,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                rotation: Math.random() * 360,
                scale: 0.8 + Math.random() * 0.4,
                delay: Math.random() * 0.2
            };
        });
        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1500);

        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 101 }}>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        fontSize: '40px',
                        animation: `emojiExplode 1.5s ease-out forwards`,
                        animationDelay: `${p.delay}s`,
                        transform: `translate(-50%, -50%) scale(0) rotate(0deg)`,
                        '--target-x': `${p.x}px`,
                        '--target-y': `${p.y}px`,
                        '--target-rotation': `${p.rotation}deg`,
                        '--target-scale': p.scale
                    }}
                >
                    {emoji}
                </div>
            ))}
        </div>
    );
}

export function FloatingNumbers({ numbers = ['+1', '+5', '+10'], onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = numbers.map((num, i) => ({
            id: i,
            text: num,
            left: 30 + (i * 20),
            delay: i * 0.15
        }));
        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [numbers, onComplete]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 99 }}>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        bottom: '20%',
                        fontSize: '32px',
                        fontWeight: 900,
                        color: '#22c55e',
                        textShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                        animation: `floatUp 2s ease-out forwards`,
                        animationDelay: `${p.delay}s`,
                        opacity: 0
                    }}
                >
                    {p.text}
                </div>
            ))}
        </div>
    );
}

export function StarBurst({ color = '#fbbf24', count = 8, onComplete }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * 2 * Math.PI;
            return {
                id: i,
                angle,
                delay: i * 0.05
            };
        });
        setParticles(newParticles);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 100 }}>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '40px',
                        background: `linear-gradient(to bottom, ${color}, transparent)`,
                        transform: `translate(-50%, -50%) rotate(${p.angle}rad)`,
                        transformOrigin: 'center',
                        animation: `starBurst 1s ease-out forwards`,
                        animationDelay: `${p.delay}s`,
                        opacity: 0
                    }}
                />
            ))}
        </div>
    );
}

export function PulseCircle({ color = '#22c55e', size = 100 }) {
    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                border: `3px solid ${color}`,
                transform: 'translate(-50%, -50%)',
                animation: 'pulseCircle 1.5s ease-out infinite',
                pointerEvents: 'none',
                zIndex: 98
            }}
        />
    );
}

// Add CSS animations to your styles.css or include them here
export const particleStyles = `
@keyframes confettiFall {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(120vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes emojiExplode {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y))) 
                   scale(var(--target-scale)) rotate(var(--target-rotation));
        opacity: 0;
    }
}

@keyframes floatUp {
    0% {
        transform: translateY(0);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px);
        opacity: 0;
    }
}

@keyframes starBurst {
    0% {
        height: 0;
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    100% {
        height: 60px;
        opacity: 0;
    }
}

@keyframes pulseCircle {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.8;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
`;
