import React, { useState, useEffect } from 'react';

export default function AIPanel({ topic, subtopic, grade }) {
    const [content, setContent] = useState(null);
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [recentGames, setRecentGames] = useState([]);

    // Load recent games from local storage on mount
    useEffect(() => {
        const savedGames = localStorage.getItem('recentGames');
        if (savedGames) {
            setRecentGames(JSON.parse(savedGames));
        }
    }, []);

    const fetchAIContent = async (forceNew = false) => {
        if (!topic) return;

        // Check for recent game in history first (unless forcing new)
        if (!forceNew && recentGames.length > 0) {
            const recentGame = recentGames.find(g => g.topic === topic && g.subtopic === subtopic);
            if (recentGame) {
                console.log("Loading recent game from cache:", recentGame.id);
                // If content is cached locally, use it immediately
                if (recentGame.htmlCode) {
                    setContent({ htmlCode: recentGame.htmlCode, id: recentGame.id });
                    setJoke(recentGame.joke || null);
                    return;
                }
                // Fallback to fetching from API if content missing (legacy cache)
                loadRecentGame(recentGame.id);
                return;
            }
        }

        const variant = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        setLoading(true);
        setError(null);
        setContent(null);
        setJoke(null);
        setSaved(false);

        try {
            const res = await fetch('http://localhost:4000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, subtopic, grade, variant })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate content');
            }

            setContent(data);
            if (data.joke) setJoke(data.joke);

            // Add to local history with FULL CONTENT
            if (data.id) {
                const newGame = {
                    id: data.id,
                    topic,
                    subtopic,
                    timestamp: Date.now(),
                    title: `${topic} Adventure`,
                    htmlCode: data.htmlCode, // Cache the game HTML
                    joke: data.joke // Cache the joke
                };
                const updatedGames = [newGame, ...recentGames.filter(g => g.id !== data.id)].slice(0, 10);
                setRecentGames(updatedGames);
                localStorage.setItem('recentGames', JSON.stringify(updatedGames));
            }

        } catch (err) {
            console.error("AI Fetch Error", err);
            setError("Oops! My brain is tired. Try again later!");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToLibrary = async () => {
        if (!content || !content.id) return;

        try {
            const res = await fetch(`http://localhost:4000/api/ai/publish/${content.id}`, {
                method: 'POST'
            });

            if (res.ok) {
                setSaved(true);
            }
        } catch (err) {
            console.error("Failed to save to library", err);
        }
    };

    const loadRecentGame = async (gameId) => {
        // First check if we have it in memory/cache
        const cachedGame = recentGames.find(g => g.id === gameId);
        if (cachedGame && cachedGame.htmlCode) {
            console.log("Instant load from local cache!");
            setContent({ htmlCode: cachedGame.htmlCode, id: cachedGame.id });
            setJoke(cachedGame.joke || null);
            setSaved(false);
            return;
        }

        setLoading(true);
        setError(null);
        setContent(null);
        setJoke(null);
        setSaved(false); // Reset saved state for re-loaded game (or check if public)

        try {
            const res = await fetch(`http://localhost:4000/api/ai/game/${gameId}`);
            const data = await res.json();

            if (!res.ok) throw new Error('Failed to load game');

            setContent({ htmlCode: data.htmlCode, id: gameId }); // Ensure ID is passed if needed
            if (data.joke) setJoke(data.joke);
        } catch (err) {
            setError("Could not load this game.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAIContent();
    }, [topic, subtopic, grade]);

    if (!topic) return null;

    return (
        <div className="ai-panel-container" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Loading State */}
            {loading && (
                <div className="ai-loading" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨🎈</div>
                    <h3 style={{ color: '#1e1b2d', margin: 0 }}>Dreaming up something cool...</h3>
                    <p style={{ color: '#64748b', marginTop: '10px' }}>Generating a unique game just for you!</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="ai-error" style={{ textAlign: 'center', padding: '20px', background: '#fee2e2', borderRadius: '16px', color: '#b91c1c' }}>
                    {error}
                </div>
            )}

            {/* Content - Render HTML in iframe */}
            {!loading && content && content.htmlCode && (
                <>
                    <div style={{ background: '#0f172a', padding: '20px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', border: '2px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <h2 style={{ marginTop: 0, marginBottom: '8px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px' }}>
                                <span>🎨</span> Cartoon Play Lab
                                {subtopic && <span style={{ background: '#1e293b', color: '#e2e8f0', padding: '6px 12px', borderRadius: '999px', fontSize: '14px', fontWeight: '600' }}>{subtopic}</span>}
                            </h2>
                            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>AI-generated interactive game for {topic}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleSaveToLibrary}
                                disabled={saved}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: saved ? '#10b981' : '#334155',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    cursor: saved ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {saved ? '✅ Saved to Library' : '💾 Save to Library'}
                            </button>
                            <button
                                onClick={() => fetchAIContent(true)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    color: 'white',
                                    fontWeight: '800',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 0 rgba(234, 88, 12, 0.4)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                🔄 Generate New
                            </button>
                        </div>
                    </div>

                    {/* Math Joke Card */}
                    {joke && (
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '20px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                border: '2px solid #e2e8f0',
                                overflow: 'hidden'
                            }}
                            dangerouslySetInnerHTML={{ __html: joke }}
                        />
                    )}

                    <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15,23,42,0.12)', border: '2px solid #e2e8f0' }}>
                        <iframe
                            srcDoc={content.htmlCode}
                            sandbox="allow-scripts"
                            style={{
                                width: '100%',
                                height: '80vh',
                                maxHeight: '800px',
                                minHeight: '500px',
                                border: 'none',
                                display: 'block'
                            }}
                            title="AI Generated Game"
                        />
                    </div>
                </>
            )}

            {/* Recent Games History */}
            {recentGames.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ color: '#475569', marginBottom: '15px' }}>🕒 Recent Games</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {recentGames.map((game) => (
                            <div
                                key={game.id}
                                onClick={() => loadRecentGame(game.id)}
                                style={{
                                    background: 'white',
                                    padding: '15px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' }}>{game.subtopic || game.topic}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {new Date(game.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
