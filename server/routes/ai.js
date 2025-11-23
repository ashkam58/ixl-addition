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

        const prompt = `
        You are a creative educational assistant for kids.
        Topic: "${topic}" ${subtopic ? `- Subtopic: "${subtopic}"` : ''} (Grade: ${grade || 'Elementary'}).

        Please generate two things in a single JSON object:
        1. "svg": A simple, cute, colorful, cartoon-style SVG code (string) illustrating this specific subtopic.
        2. "game": An interactive mini-game configuration. Choose one of the following types based on what fits the topic best:

        TYPE A: "counter_adventure" (Best for addition, subtraction, counting, integers)
        {
          "type": "counter_adventure",
          "story": "A short, fun instruction (e.g., 'Help the bunny collect 5 carrots!')",
          "target": 5, (The number they need to reach)
          "initial": 0, (Starting number)
          "itemEmoji": "🥕", (Emoji to count)
          "itemName": "carrot",
          "winMessage": "Yay! You found them all!"
        }

        TYPE B: "quiz" (Best for logic, geometry, complex topics)
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            throw new Error(data.error?.message || 'Failed to fetch from Gemini');
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No content generated');
        }

        // Clean up markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonStr);

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

module.exports = router;
