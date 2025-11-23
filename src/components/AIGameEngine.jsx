import React, { useState, useEffect } from 'react';

export default function AIGameEngine({ gameConfig }) {
    if (!gameConfig) return null;

    if (gameConfig.type === 'counter_adventure') {
        return <CounterAdventureGame config={gameConfig} />;
    }

    if (gameConfig.type === 'quiz' || gameConfig.question) {
        return <QuizGame config={gameConfig} />;
    }

    return <div>Unknown game type</div>;
}

function CounterAdventureGame({ config }) {
    const [count, setCount] = useState(config.initial || 0);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        if (count === config.target) {
            setIsWon(true);
        } else {
            setIsWon(false);
        }
    }, [count, config.target]);

    return (
        <div className="game-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#334155', marginBottom: '20px' }}>{config.story}</h3>

            <div style={{ fontSize: '60px', margin: '20px 0', minHeight: '80px' }}>
                {Array.from({ length: Math.max(0, count) }).map((_, i) => (
                    <span key={i} style={{ margin: '0 5px', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        {config.itemEmoji}
                    </span>
                ))}
                {count === 0 && <span style={{ opacity: 0.3, fontSize: '40px' }}>(Empty)</span>}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => setCount(c => c - 1)}
                    style={{ padding: '12px 24px', fontSize: '24px', borderRadius: '12px', border: '2px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                >
                    ➖ Remove
                </button>
                <button
                    onClick={() => setCount(c => c + 1)}
                    style={{ padding: '12px 24px', fontSize: '24px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', boxShadow: '0 4px 0 #2563eb' }}
                >
                    ➕ Add {config.itemName}
                </button>
            </div>

            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b' }}>
                Count: {count} / {config.target}
            </div>

            {isWon && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#dcfce7', borderRadius: '12px', color: '#166534', animation: 'slideUp 0.5s ease' }}>
                    🎉 <strong>{config.winMessage}</strong>
                </div>
            )}
        </div>
    );
}

function QuizGame({ config }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    return (
        <div className="game-card" style={{ background: 'white', padding: '24px', borderRadius: '20px' }}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#334155', marginBottom: '24px', lineHeight: '1.5' }}>
                {config.question}
            </p>

            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {config.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt == config.answer;
                    let btnStyle = {
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid #cbd5e1',
                        background: 'white',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: '#475569'
                    };

                    if (showExplanation) {
                        if (isCorrect) {
                            btnStyle.background = '#dcfce7';
                            btnStyle.borderColor = '#86efac';
                            btnStyle.color = '#15803d';
                        } else if (isSelected) {
                            btnStyle.background = '#fee2e2';
                            btnStyle.borderColor = '#fca5a5';
                            btnStyle.color = '#b91c1c';
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                if (showExplanation) return;
                                setSelectedOption(opt);
                                setShowExplanation(true);
                            }}
                            style={btnStyle}
                            disabled={showExplanation}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="explanation" style={{ marginTop: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#166534' }}>
                    <strong>{selectedOption == config.answer ? "🎉 Correct!" : "🤔 Nice try!"}</strong> {config.explanation}
                </div>
            )}
        </div>
    );
}
