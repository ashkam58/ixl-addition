const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const AIContent = require('../models/AIContent');

router.post('/generate', async (req, res) => {
    console.log("AI Request received");
    console.log("API Key present:", !!GEMINI_API_KEY);
    try {
        const { topic, subtopic, grade } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        // 1. Check Cache
        const cached = await AIContent.findOne({ topic, subtopic, grade });
        if (cached) {
            console.log("Returning cached content for:", topic, subtopic);
            return res.json(cached.content);
        }

        console.log("Generating new content for:", topic, subtopic);

        // Parallel Generation: Game (Text) + Infographic (Image)
        const [gameResult, imageResult] = await Promise.allSettled([
            generateGameConfig(topic, subtopic, grade),
            generateInfographicImage(topic, subtopic)
        ]);

        const game = gameResult.status === 'fulfilled' ? gameResult.value : null;
        const image = imageResult.status === 'fulfilled' ? imageResult.value : null;

        if (!game) {
            throw new Error(gameResult.reason?.message || 'Failed to generate game');
        }

        const result = {
            game: game,
            image: image, // Base64 string
            svg: null // Deprecated
        };

        // 2. Save to Cache
        await AIContent.create({
            topic,
            subtopic,
            grade,
            content: result
        });

        res.json(result);

    } catch (err) {
        console.error('--------------------------------------------------');
        console.error('AI GENERATION ERROR');
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        if (err.cause) console.error('Cause:', err.cause);
        console.error('--------------------------------------------------');
        res.status(500).json({ error: 'Failed to generate content', details: err.message });
    }
});

async function generateGameConfig(topic, subtopic, grade) {
    const prompt = `
    You are a creative educational assistant for kids.
    Topic: "${topic}" ${subtopic ? `- Subtopic: "${subtopic}"` : ''} (Grade: ${grade || 'Elementary'}).

    Generate an interactive mini-game configuration in JSON format.
    Choose one of the following types:

    TYPE A: "counter_adventure" (Best for addition, subtraction, counting)
    {
      "type": "counter_adventure",
      "story": "Fun story...",
      "target": 5,
      "initial": 0,
      "itemEmoji": "🥕",
      "itemName": "carrot",
      "winMessage": "Yay!"
    }

    TYPE B: "quiz" (Best for logic, geometry)
    {
      "type": "quiz",
      "question": "...",
      "options": ["..."],
      "answer": "...",
      "explanation": "..."
    }

    Return ONLY valid JSON.
    `;

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini Text Error');

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No text generated');

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
}

async function generateInfographicImage(topic, subtopic) {
    try {
        // Using Imagen 3 (or Gemini 2.5 Flash Image if available)
        // Note: The endpoint for Imagen on AI Studio is often different. 
        // We'll try the standard v1beta predict endpoint for Imagen.
        const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;

        const prompt = `Cartoon sci-fi cinematic infographic explaining "${subtopic || topic}". 
        Futuristic HUD interface, neon colors, dark background, glowing elements. 
        Educational math concept visualization. High quality, detailed, 4k.`;

        const response = await fetch(IMAGEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1, aspectRatio: "16:9" }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.warn('Imagen API Error:', data);
            return null; // Fallback to no image if fails
        }

        // Imagen returns base64 in predictions[0].bytesBase64Encoded
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (base64) {
            return `data:image/png;base64,${base64}`;
        }
        return null;
    } catch (e) {
        console.error("Image Gen Failed:", e);
        return null;
    }
}

module.exports = router;
