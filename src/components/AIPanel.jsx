import React, { useState, useEffect } from 'react';
import AIGameEngine from './AIGameEngine';

export default function AIPanel({ topic, subtopic, grade }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!topic) return;

        async function fetchAIContent() {
            setLoading(true);
            setError(null);
            setContent(null);

            try {
                // Use localhost for development
                const res = await fetch('http://localhost:4000/api/ai/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, subtopic, grade })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to generate content');
                }

                setContent(data);
            } catch (err) {
                console.error("AI Fetch Error", err);
                setError("Oops! My brain is tired. Try again later! 🤖");
            } finally {
                setLoading(false);
            }
        }

        fetchAIContent();
    }, [topic, subtopic, grade]);

    if (!topic) return null;

    return (
        <div className="ai-panel-container" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Loading State */}
            {loading && (
                <div className="ai-loading" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖 🎨</div>
                    <h3 style={{ color: '#1e1b2d', margin: 0 }}>Dreaming up something cool...</h3>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="ai-error" style={{ textAlign: 'center', padding: '20px', background: '#fee2e2', borderRadius: '16px', color: '#b91c1c' }}>
                    {error}
                </div>
            )}

            {/* Content */}
            {!loading && content && (
                <>
                    {/* Section 1: Cartoon Illustration */}
                    <div className="ai-illustration-section" style={{ background: '#0f172a', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '2px solid #334155' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🚀</span> {topic} Mission Brief
                        </h2>
                        <div
                            className="svg-container"
                            dangerouslySetInnerHTML={{ __html: content.svg }}
                            style={{ width: '100%', maxHeight: '400px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                        />
                    </div>

                    {/* Section 2: AI Mini Game */}
                    <div className="ai-game-section" style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', padding: '30px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '2px solid #bae6fd' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🎮</span> Bonus Challenge
                        </h2>

                        <AIGameEngine gameConfig={content.game} />
                    </div>
                </>
            )}
        </div>
    );
}
