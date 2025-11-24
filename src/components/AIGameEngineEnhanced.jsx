import React, { useState, useEffect } from 'react';
import { Confetti, EmojiExplosion, FloatingNumbers, StarBurst, PulseCircle } from './ParticleEffects';

export default function AIGameEngine({ gameConfig }) {
    if (!gameConfig) return null;

    if (gameConfig.type === 'counter_adventure') {
        return <CounterAdventureGame config={gameConfig} />;
    }

    if (gameConfig.type === 'fraction_baker') {
        return <FractionBakerGame config={gameConfig} />;
    }

    if (gameConfig.type === 'area_architect') {
        return <AreaArchitectGame config={gameConfig} />;
    }

    if (gameConfig.type === 'drag_drop_sorter') {
        return <DragDropSorterGame config={gameConfig} />;
    }

    if (gameConfig.type === 'number_line_jumper') {
        return <NumberLineJumperGame config={gameConfig} />;
    }

    if (gameConfig.type === 'shape_builder') {
        return <ShapeBuilderGame config={gameConfig} />;
    }

    if (gameConfig.type === 'quiz' || gameConfig.question) {
        return <QuizGame config={gameConfig} />;
    }

    return <div>Unknown game type</div>;
}

// Enhanced Counter Adventure with Particle Effects
function CounterAdventureGame({ config }) {
    const {
        title = 'Play Lab',
        target = 5,
        min = 0,
        max = Math.max(8, target),
        itemName = 'item',
        itemEmoji = '⭐',
        winMessage = 'Nice work!',
        story = 'Collect the items to hit the goal!',
        theme = {}
    } = config;

    const increments = Array.isArray(config.increments) && config.increments.length
        ? config.increments
        : [
            { label: 'Add 1', delta: 1, emoji: '➕', color: '#22c55e' },
            { label: 'Subtract 1', delta: -1, emoji: '➖', color: '#fb7185' }
        ];

    const clamp = (value) => Math.max(min, Math.min(max, value));

    const [count, setCount] = useState(clamp(config.initial ?? 0));
    const [showConfetti, setShowConfetti] = useState(false);
    const [showEmojiExplosion, setShowEmojiExplosion] = useState(false);
    const [floatingNums, setFloatingNums] = useState([]);

    useEffect(() => {
        setCount(clamp(config.initial ?? 0));
    }, [config.initial, min, max, target]);

    const denominator = Math.max(1, Math.abs(target - min));
    const progress = Math.max(0, Math.min(100, ((count - min) / denominator) * 100));
    const isWon = count === target;
    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    useEffect(() => {
        if (isWon && !showConfetti) {
            setShowConfetti(true);
            setShowEmojiExplosion(true);
        }
    }, [isWon]);

    const handleIncrement = (inc) => {
        const newValue = clamp(count + inc.delta);
        setCount(newValue);

        // Show floating number animation
        setFloatingNums(prev => [...prev, { value: inc.delta, id: Date.now() }]);
        setTimeout(() => {
            setFloatingNums(prev => prev.slice(1));
        }, 2000);
    };

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.65, zIndex: 0 }} />

            {/* Particle Effects */}
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            {showEmojiExplosion && <EmojiExplosion emoji={itemEmoji} count={15} onComplete={() => setShowEmojiExplosion(false)} />}
            {floatingNums.map(num => (
                <FloatingNumbers key={num.id} numbers={[num.value > 0 ? `+${num.value}` : `${num.value}`]} />
            ))}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                        <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                        <p style={{ margin: '4px 0 0', color: '#334155', fontWeight: 600 }}>Goal: {target} {itemName}s</p>
                    </div>
                    {theme.character && (
                        <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '8px 12px', borderRadius: '14px', fontWeight: 700 }}>
                            {theme.character}
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.78)', borderRadius: '18px', padding: '14px', border: `2px solid ${accent}`, position: 'relative' }}>
                        {isWon && <PulseCircle color={accent} size={120} />}
                        <div style={{ fontSize: '56px', textAlign: 'center', minHeight: '72px', letterSpacing: '4px', transition: 'transform 0.3s ease', transform: isWon ? 'scale(1.1)' : 'scale(1)' }}>
                            {(Math.abs(count) > 0 ? itemEmoji.repeat(Math.max(0, Math.min(10, Math.abs(count)))) : '∙')}
                        </div>
                        <div style={{ textAlign: 'center', fontWeight: 800, color: '#0f172a', fontSize: '32px' }}>
                            {count}
                        </div>
                        <div style={{ textAlign: 'center', color: '#475569', fontWeight: 700 }}>
                            {itemName.toUpperCase()}
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {increments.map((inc, idx) => (
                                <button
                                    key={`${inc.label}-${idx}`}
                                    onClick={() => handleIncrement(inc)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: inc.color || accent,
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        boxShadow: '0 6px 0 rgba(15,23,42,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '10px',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 0 rgba(15,23,42,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 6px 0 rgba(15,23,42,0.12)';
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'translateY(2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 0 rgba(15,23,42,0.12)';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 0 rgba(15,23,42,0.12)';
                                    }}
                                >
                                    <span style={{ fontSize: '22px' }}>{inc.emoji || '⭐'}</span>
                                    <span>{inc.label} ({inc.delta > 0 ? '+' : ''}{inc.delta})</span>
                                    <span style={{ fontSize: '18px', opacity: 0.8 }}>▶</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(15,23,42,0.85)', borderRadius: '14px', padding: '12px', color: '#e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700 }}>Progress</span>
                        <span style={{ fontWeight: 700 }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: accent, transition: 'width 0.25s ease' }} />
                    </div>
                </div>

                {isWon && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// Enhanced Fraction Baker
function FractionBakerGame({ config }) {
    const {
        title = 'Slice Lab',
        story = 'Balance the slices to match the target fraction.',
        targetFraction = { numerator: 3, denominator: 4 },
        currentFraction = { numerator: 1, denominator: 4 },
        controls = [],
        theme = {},
        winMessage = 'Perfect slice match!'
    } = config;

    const [numerator, setNumerator] = useState(currentFraction.numerator ?? 1);
    const [denominator, setDenominator] = useState(currentFraction.denominator ?? 4);
    const [showCelebration, setShowCelebration] = useState(false);

    const clamp = (val, min = -12, max = 12) => Math.max(min, Math.min(max, val));

    const handleControl = (ctrl) => {
        setNumerator((n) => clamp(n + (ctrl.numeratorDelta || 0)));
        setDenominator((d) => clamp(Math.max(1, d + (ctrl.denominatorDelta || 0)), 1, 24));
    };

    const areEqual = (aNum, aDen, bNum, bDen) => aNum * bDen === bNum * aDen;
    const isMatch = areEqual(numerator, denominator, targetFraction.numerator, targetFraction.denominator);

    useEffect(() => {
        if (isMatch && !showCelebration) {
            setShowCelebration(true);
        }
    }, [isMatch]);

    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    const fractionPercent = Math.max(0, Math.min(100, (numerator / denominator) * 100));
    const targetPercent = Math.max(0, Math.min(100, (targetFraction.numerator / targetFraction.denominator) * 100));

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.7, zIndex: 0 }} />

            {showCelebration && <Confetti onComplete={() => setShowCelebration(false)} />}
            {showCelebration && <EmojiExplosion emoji="🍰" count={12} />}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                        <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                        <p style={{ margin: '4px 0 0', color: '#334155', fontWeight: 600 }}>Target: {targetFraction.numerator}/{targetFraction.denominator}</p>
                    </div>
                    {theme.character && (
                        <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '8px 12px', borderRadius: '14px', fontWeight: 700 }}>
                            {theme.character}
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '14px', border: `2px solid ${accent}` }}>
                        <div style={{ marginBottom: '10px', fontWeight: 800, color: '#0f172a' }}>Your Slice</div>
                        <div style={{ position: 'relative', height: '44px', borderRadius: '14px', background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fractionPercent}%`, background: accent, transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0f172a' }}>
                                {numerator}/{denominator}
                            </div>
                        </div>
                        <div style={{ marginTop: '10px', fontWeight: 700, color: '#475569' }}>Target Slice</div>
                        <div style={{ position: 'relative', height: '30px', borderRadius: '10px', background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${targetPercent}%`, background: '#22c55e', opacity: 0.8 }} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(controls.length ? controls : defaultFractionControls()).map((ctrl, idx) => (
                                <button
                                    key={`${ctrl.label}-${idx}`}
                                    onClick={() => handleControl(ctrl)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: ctrl.color || accent,
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        boxShadow: '0 6px 0 rgba(15,23,42,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '10px'
                                    }}
                                >
                                    <span style={{ fontSize: '22px' }}>{ctrl.emoji || '🍰'}</span>
                                    <span>{ctrl.label}</span>
                                    <span style={{ fontSize: '18px', opacity: 0.8 }}>▶</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isMatch && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// Re-use existing Area Architect and Quiz components (keeping them simple for now)
function AreaArchitectGame({ config }) {
    const {
        title = 'Build Lab',
        story = 'Adjust rows and columns to match the target area.',
        targetProduct = 24,
        grid = { rows: 3, cols: 4 },
        controls = [],
        theme = {},
        winMessage = 'Area unlocked!'
    } = config;

    const [rows, setRows] = useState(grid.rows ?? 3);
    const [cols, setCols] = useState(grid.cols ?? 4);
    const [showCelebration, setShowCelebration] = useState(false);

    const clamp = (val, min = 1, max = 12) => Math.max(min, Math.min(max, val));

    const handleControl = (ctrl) => {
        setRows((r) => clamp(r + (ctrl.deltaRow || 0)));
        setCols((c) => clamp(c + (ctrl.deltaCol || 0)));
    };

    const product = rows * cols;
    const isMatch = product === targetProduct;

    useEffect(() => {
        if (isMatch && !showCelebration) {
            setShowCelebration(true);
        }
    }, [isMatch]);

    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    const gridCells = Math.min(product, 72);

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.65, zIndex: 0 }} />

            {showCelebration && <Confetti onComplete={() => setShowCelebration(false)} />}
            {showCelebration && <StarBurst color={accent} count={12} />}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                        <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                        <p style={{ margin: '4px 0 0', color: '#334155', fontWeight: 600 }}>Target Area: {targetProduct}</p>
                    </div>
                    {theme.character && (
                        <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '8px 12px', borderRadius: '14px', fontWeight: 700 }}>
                            {theme.character}
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '14px', border: `2px solid ${accent}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: '#0f172a', fontWeight: 800 }}>
                            <span>Rows: {rows}</span>
                            <span>Cols: {cols}</span>
                            <span>Area: {product}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(12px, 1fr))`, gap: '4px', maxHeight: '240px', overflowY: 'auto' }}>
                            {Array.from({ length: gridCells }).map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        height: '26px',
                                        borderRadius: '6px',
                                        background: idx % 2 === 0 ? accent : '#38bdf8',
                                        opacity: 0.9,
                                        animation: `bounceIn ${0.3 + (idx * 0.01)}s ease-out`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '18px', padding: '14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(controls.length ? controls : defaultAreaControls()).map((ctrl, idx) => (
                                <button
                                    key={`${ctrl.label}-${idx}`}
                                    onClick={() => handleControl(ctrl)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: ctrl.color || accent,
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        boxShadow: '0 6px 0 rgba(15,23,42,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '10px'
                                    }}
                                >
                                    <span style={{ fontSize: '22px' }}>{ctrl.emoji || '🔲'}</span>
                                    <span>{ctrl.label}</span>
                                    <span style={{ fontSize: '18px', opacity: 0.8 }}>▶</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isMatch && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// NEW GAME TYPE: Drag & Drop Sorter
function DragDropSorterGame({ config }) {
    const {
        title = 'Sort the Items',
        story = 'Drag items to the correct category!',
        items = [],
        categories = [],
        theme = {},
        winMessage = 'Perfect sorting!'
    } = config;

    const [itemStates, setItemStates] = useState(items.map(item => ({ ...item, placed: false, category: null })));
    const [draggedItem, setDraggedItem] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);

    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    const handleDragStart = (item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (catId) => {
        if (!draggedItem) return;

        const isCorrect = draggedItem.category === catId;

        setItemStates(prev => prev.map(item =>
            item.id === draggedItem.id
                ? { ...item, placed: true, category: catId, correct: isCorrect }
                : item
        ));

        setDraggedItem(null);
    };

    const unplacedItems = itemStates.filter(item => !item.placed);
    const allPlaced = itemStates.length > 0 && itemStates.every(item => item.placed && item.correct);

    useEffect(() => {
        if (allPlaced && !showCelebration) {
            setShowCelebration(true);
        }
    }, [allPlaced]);

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.7, zIndex: 0 }} />

            {showCelebration && <Confetti />}
            {showCelebration && <EmojiExplosion emoji="🎯" count={15} />}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                    <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                </div>

                {/* Draggable Items */}
                <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '14px', border: `2px solid ${accent}` }}>
                    <div style={{ fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>Items to Sort:</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', minHeight: '60px' }}>
                        {unplacedItems.map(item => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(item)}
                                className="draggable-item"
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    background: '#38bdf8',
                                    color: '#0f172a',
                                    fontWeight: 800,
                                    cursor: 'grab',
                                    boxShadow: '0 4px 0 rgba(15,23,42,0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drop Zones */}
                <div style={{ display: 'grid', gridTemplateColumns: categories.length === 2 ? '1fr 1fr' : '1fr', gap: '12px' }}>
                    {categories.map(cat => {
                        const placedInCat = itemStates.filter(item => item.placed && item.category === cat.id);
                        return (
                            <div
                                key={cat.id}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(cat.id)}
                                className="drop-zone"
                                style={{
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: '18px',
                                    padding: '14px',
                                    border: `2px dashed ${cat.color || accent}`,
                                    minHeight: '100px'
                                }}
                            >
                                <div style={{ fontWeight: 800, marginBottom: '10px', color: cat.color || accent }}>{cat.label}</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {placedInCat.map(item => (
                                        <div
                                            key={item.id}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                background: item.correct ? '#22c55e' : '#ef4444',
                                                color: '#fff',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                animation: 'bounceIn 0.3s ease-out'
                                            }}
                                        >
                                            <span>{item.emoji}</span>
                                            <span>{item.label}</span>
                                            {item.correct && <span>✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {allPlaced && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// NEW GAME TYPE: Number Line Jumper
function NumberLineJumperGame({ config }) {
    const {
        title = 'Number Line Adventure',
        story = 'Jump to the target number!',
        start = 0,
        target = 10,
        min = -5,
        max = 15,
        jumps = [],
        theme = {},
        winMessage = 'Target reached!'
    } = config;

    const [position, setPosition] = useState(start);
    const [showCelebration, setShowCelebration] = useState(false);

    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    const handleJump = (jump) => {
        const newPos = Math.max(min, Math.min(max, position + jump.value));
        setPosition(newPos);
    };

    const isWon = position === target;
    const range = max - min;
    const positionPercent = ((position - min) / range) * 100;
    const targetPercent = ((target - min) / range) * 100;

    useEffect(() => {
        if (isWon && !showCelebration) {
            setShowCelebration(true);
        }
    }, [isWon]);

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.7, zIndex: 0 }} />

            {showCelebration && <Confetti />}
            {showCelebration && <EmojiExplosion emoji="🎯" count={12} />}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                    <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                    <p style={{ margin: '4px 0 0', color: '#334155', fontWeight: 600 }}>Target: {target}</p>
                </div>

                {/* Number Line */}
                <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '20px 14px', border: `2px solid ${accent}` }}>
                    <div style={{ position: 'relative', height: '80px', marginBottom: '10px' }}>
                        {/* Line */}
                        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '4px', background: '#e2e8f0', borderRadius: '999px' }} />

                        {/* Target marker */}
                        <div style={{ position: 'absolute', left: `${targetPercent}%`, top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ width: '40px', height: '40px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)', animation: 'pulseScale 1.5s ease-in-out infinite' }}>
                                {target}
                            </div>
                        </div>

                        {/* Current position */}
                        <div style={{ position: 'absolute', left: `${positionPercent}%`, top: '50%', transform: 'translate(-50%, -50%)', transition: 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                            <div style={{ width: '50px', height: '50px', background: accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '20px', boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
                                {position}
                            </div>
                        </div>
                    </div>

                    {/* Number labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                        <span>{min}</span>
                        <span>{max}</span>
                    </div>
                </div>

                {/* Jump Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(jumps.length, 3)}, 1fr)`, gap: '10px' }}>
                    {jumps.map((jump, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleJump(jump)}
                            style={{
                                padding: '14px',
                                borderRadius: '14px',
                                border: 'none',
                                background: jump.color || accent,
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 0 rgba(15,23,42,0.12)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span style={{ fontSize: '28px' }}>{jump.emoji}</span>
                            <span>{jump.label}</span>
                        </button>
                    ))}
                </div>

                {isWon && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// NEW GAME TYPE: Shape Builder (simplified version)
function ShapeBuilderGame({ config }) {
    const {
        title = 'Shape Builder',
        story = 'Build the target shape!',
        targetShape = 'rectangle',
        pieces = [],
        theme = {},
        winMessage = 'Shape complete!'
    } = config;

    const [placedPieces, setPlacedPieces] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);

    const background = theme.background || 'linear-gradient(135deg, #fef3c7, #e0f2fe)';
    const panel = theme.panel || 'rgba(255,255,255,0.9)';
    const accent = theme.accent || '#f97316';

    const handlePlacePiece = (piece) => {
        setPlacedPieces(prev => [...prev, piece]);
    };

    const isComplete = placedPieces.length >= pieces.length;

    useEffect(() => {
        if (isComplete && !showCelebration) {
            setShowCelebration(true);
        }
    }, [isComplete]);

    return (
        <div className="game-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', padding: '20px', background: panel, boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <div style={{ position: 'absolute', inset: 0, background, opacity: 0.7, zIndex: 0 }} />

            {showCelebration && <Confetti />}
            {showCelebration && <StarBurst color={accent} />}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <p style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '22px', lineHeight: 1.2 }}>{title}</p>
                    <p style={{ margin: '6px 0 0', color: '#0f172a', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>{story}</p>
                    <p style={{ margin: '4px 0 0', color: '#334155', fontWeight: 600 }}>Target: {targetShape}</p>
                </div>

                {/* Canvas */}
                <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '20px', border: `2px solid ${accent}`, minHeight: '150px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {placedPieces.map((piece, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: `${piece.size * 30}px`,
                                    height: `${piece.size * 30}px`,
                                    background: piece.color,
                                    borderRadius: piece.type === 'circle' ? '50%' : '8px',
                                    animation: 'bounceIn 0.4s ease-out',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Piece Palette */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pieces.length, 4)}, 1fr)`, gap: '10px' }}>
                    {pieces.map((piece, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePlacePiece(piece)}
                            disabled={placedPieces.filter(p => p.id === piece.id).length > 0}
                            className="shape-piece"
                            style={{
                                padding: '16px',
                                borderRadius: '14px',
                                border: 'none',
                                background: placedPieces.filter(p => p.id === piece.id).length > 0 ? '#e2e8f0' : piece.color,
                                cursor: placedPieces.filter(p => p.id === piece.id).length > 0 ? 'not-allowed' : 'pointer',
                                boxShadow: '0 6px 0 rgba(15,23,42,0.12)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: placedPieces.filter(p => p.id === piece.id).length > 0 ? 0.5 : 1
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#fff',
                                borderRadius: piece.type === 'circle' ? '50%' : '6px'
                            }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{piece.type}</span>
                        </button>
                    ))}
                </div>

                {isComplete && (
                    <div style={{ marginTop: '6px', padding: '14px', background: '#dcfce7', borderRadius: '14px', color: '#166534', fontWeight: 800, textAlign: 'center', boxShadow: '0 12px 24px rgba(22,101,52,0.12)', animation: 'bounceIn 0.5s ease-out' }}>
                        ✅ {winMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

// Quiz Game (keeping existing implementation)
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
                    <strong>{selectedOption == config.answer ? "✅ Correct!" : "⭐ Nice try!"}</strong> {config.explanation}
                </div>
            )}
        </div>
    );
}

function defaultFractionControls() {
    return [
        { label: 'Add top', numeratorDelta: 1, emoji: '🍰', color: '#22c55e' },
        { label: 'Remove top', numeratorDelta: -1, emoji: '🥄', color: '#fb7185' },
        { label: 'Stretch bottom', denominatorDelta: 1, emoji: '🎈', color: '#38bdf8' }
    ];
}

function defaultAreaControls() {
    return [
        { label: 'Add row', deltaRow: 1, emoji: '⬆', color: '#22c55e' },
        { label: 'Remove row', deltaRow: -1, emoji: '⬇', color: '#fb7185' },
        { label: 'Add column', deltaCol: 1, emoji: '➡', color: '#38bdf8' },
        { label: 'Remove column', deltaCol: -1, emoji: '⬅', color: '#facc15' }
    ];
}
