const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const AIContent = require('../models/AIContent');

router.post('/generate', async (req, res) => {
    console.log("AI Request received");
    console.log("API Key present:", !!GEMINI_API_KEY);
    try {
        const { topic, subtopic, grade, variant } = req.body || {};

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const skipCache = Boolean(variant);

        // 1. Check Cache unless variant requests a fresh run
        if (!skipCache) {
            const cached = await AIContent.findOne({ topic, subtopic, grade });
            if (cached) {
                console.log("Returning cached content for:", topic, subtopic);
                return res.json(cached.content);
            }
        }

        console.log("Generating new content for:", topic, subtopic, "variant:", variant || "default");

        // Generate complete HTML application
        const htmlResult = await generateGameConfig({ topic, subtopic, grade, variant });

        if (!htmlResult || !htmlResult.htmlCode) {
            throw new Error('Failed to generate HTML application');
        }

        const result = {
            htmlCode: htmlResult.htmlCode,
            image: null, // Deprecated for now
            svg: null // Deprecated
        };

        // 2. Save to Cache / Library
        let savedContent;
        if (!skipCache) {
            savedContent = await AIContent.create({
                topic,
                subtopic,
                grade,
                content: result,
                title: `${topic} Adventure`,
                description: `An interactive game about ${subtopic || topic}`,
                isPublic: false,
                joke: htmlResult.joke // Save the joke
            });
        }

        // Return the content plus the ID if saved
        res.json({
            ...result,
            joke: htmlResult.joke, // Return joke to frontend
            id: savedContent ? savedContent._id : null
        });

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

// --- NEW LIBRARY ENDPOINTS ---

// Publish a game to the library
router.post('/publish/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const game = await AIContent.findByIdAndUpdate(
            id,
            { isPublic: true },
            { new: true }
        );

        if (!game) return res.status(404).json({ error: 'Game not found' });

        res.json({ success: true, game });
    } catch (err) {
        res.status(500).json({ error: 'Failed to publish game' });
    }
});

// Get public library games
router.get('/library', async (req, res) => {
    try {
        const games = await AIContent.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('topic subtopic grade title description createdAt plays likes');

        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch library' });
    }
});

// Get a specific game by ID (for playing from library)
router.get('/game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const game = await AIContent.findById(id);

        if (!game) return res.status(404).json({ error: 'Game not found' });

        // Increment play count
        game.plays += 1;
        await game.save();

        res.json({
            ...game.content,
            joke: game.joke
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

async function generateGameConfig({ topic, subtopic, grade, variant }) {
    const topicLabel = subtopic || topic;
    const prompt = buildHTMLPrompt({ topic, subtopic, grade, variant });

    const response = await fetch(GEMINI_TEXT_URL, {
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

    // Parse the response using delimiters
    let htmlCode = '';
    let joke = '';

    if (text.includes('<<<GAME>>>')) {
        const gameMatch = text.match(/<<<GAME>>>([\s\S]*?)(?:<<<JOKE>>>|$)/);
        if (gameMatch) htmlCode = gameMatch[1].trim();

        const jokeMatch = text.match(/<<<JOKE>>>([\s\S]*?)$/);
        if (jokeMatch) joke = jokeMatch[1].trim();
    } else {
        // Fallback for legacy/malformed response
        htmlCode = text.trim();
    }

    // Clean up markdown code fences
    htmlCode = htmlCode.replace(/```html\n?/gi, '').replace(/```\n?$/g, '').trim();
    joke = joke.replace(/```html\n?/gi, '').replace(/```\n?$/g, '').trim();

    // Validate HTML
    if (!htmlCode.includes('<!DOCTYPE') && !htmlCode.includes('<html')) {
        console.warn('Generated text does not appear to be HTML, using fallback');
        return { htmlCode: buildFallbackHTML(topicLabel), joke: null };
    }

    return { htmlCode, joke };
}

function buildHTMLPrompt({ topic, subtopic, grade, variant }) {
    const topicLabel = subtopic || topic;

    const prompt = `You are a creative web app designer for kids. Generate a COMPLETE, STANDALONE HTML file for an interactive math game.

Topic: "${topic}"
${subtopic ? `Subtopic: "${subtopic}"` : ''}
Grade Level: ${grade || 'Elementary'}
Variant: ${variant || 'default'}

CRITICAL REQUIREMENTS:
1. Output TWO parts separated by delimiters:
   <<<GAME>>>
   [Complete HTML for the interactive game]
   <<<JOKE>>>
   [Complete HTML for the math joke]

2. GAME RULES (STRICT):
   - **NOT A QUIZ!** Do NOT create question-answer formats or multiple choice.
   - Create an **INTERACTIVE GAME** with visual manipulation (clicking, dragging, building).
   - Think: Clicker Labs, Visual Builders, Interactive Manipulatives, Pattern Makers.
   - Output complete HTML (from <!DOCTYPE html> to </html>)
   - Embed ALL CSS/JS. No external libraries.
   - **CRITICAL:** Ensure all JavaScript is syntactically valid. Use proper quotes, semicolons, and brackets.
   - Fully mobile-responsive (viewport meta tag, flexbox/grid).
   - Container max-width: 600px.
   - Touch-friendly interactive elements (min 44px).

3. GAME TYPES BY TOPIC:
   **Addition/Subtraction:** Number builders, group clickers, visual counters
   **Fractions:** Slice builders, fraction bars, pizza cutters, visual fraction matchers
   **Multiplication:** Array builders, group makers, pattern grids
   **Geometry:** Shape builders, pattern makers, symmetry creators
   **Measurement:** Visual rulers, balance scales, estimation games
   
4. JOKE RULES:
   - Create a "Math Giggle" card with a fun fact or joke about "${topicLabel}".
   - Output complete HTML snippet (div with styles).
   - Make it interactive (click to reveal, hover to animate).
   - Use emojis and bright colors.
   - Keep it small and embeddable.

RESPONSIVENESS & LAYOUT RULES (STRICT):
- MUST be fully mobile-responsive. Use <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
- The app must fit perfectly within a small container (mobile view) AND look good on desktop.
- Use Flexbox or Grid for layout.
- Container width should be "width: 100%; max-width: 600px; margin: 0 auto;"
- Use "min-height: 100vh" for the body to center content vertically if needed, but ensure no scrolling is forced if content fits.
- Buttons and interactive elements must be large enough for touch targets (min 44px height).
- Font sizes must scale or be readable on small screens (use rem or viewport units).
- Prevent horizontal scrolling.

DESIGN REQUIREMENTS (GAME-FOCUSED):
- Create a **VISUAL, INTERACTIVE GAME** (NOT a quiz or question-answer format).
- Examples of good game mechanics:
  * **Clicker/Builder:** Click to add/remove objects, build groups, create patterns
  * **Drag-and-Drop:** Drag items to categories, sort, match, arrange
  * **Visual Manipulative:** Slice fractions, adjust number lines, build shapes
  * **Pattern Maker:** Click tiles to create patterns, symmetry, designs
- Use **large, touchable elements** (circles, squares, visual objects)
- Provide **instant visual feedback** (animations, color changes, sounds)
- Include a **clear goal** ("Build 5 groups of 3" or "Match all pairs")
- Show **progress visually** (progress bars, counters, visual completion)
- Celebrate success with **animations and confetti** 🎉
- Use vibrant gradient backgrounds and playful characters
- Make numbers appropriate for grade ${grade}

INTERACTION REQUIREMENTS (GAME-BASED):
- **Click-to-interact:** Large buttons, draggable objects, clickable zones
- **Visual manipulation:** See results immediately (objects appear, move, change)
- **Clear goal:** Display target clearly ("Build 2 × 5 = 10" or "Slice into 4 equal parts")
- **Progress tracking:** Show score, completion status, or visual progress
- **Success celebration:** Big "YOU DID IT!" with animations when goal is reached
- **Reset/Retry:** Allow starting over or trying a new challenge

STYLE INSPIRATION & CSS RULES (STRICT):
- **Theme:** "3D Cartoon" aesthetic. Everything should look tactile and chunky.
- **Colors:** Use VIBRANT, saturated colors (e.g., #FF6B6B, #4ECDC4, #FFE66D). Avoid dull greys.
- **Buttons (CRITICAL):**
  - Must look like physical 3D buttons.
  - CSS: \`border: none; border-radius: 16px; border-bottom: 6px solid [darker_shade]; transition: all 0.1s;\`
  - Active State: \`transform: translateY(4px); border-bottom-width: 2px;\`
- **Containers:**
  - White or light panels with rounded corners (24px).
  - Deep, soft shadows: \`box-shadow: 0 10px 25px rgba(0,0,0,0.15);\`
- **Typography:**
  - Use system fonts but make them round: \`font-family: 'Segoe UI', 'Comic Sans MS', sans-serif;\`
  - Headings should be large, colorful, and playful.
- **Feedback:**
  - When clicking correct answers, show a "POP" animation.
  - Success messages should be big overlays with confetti-like colors.

EXAMPLE THEMES (be creative, don't copy):
- "Group Builder Lab" - Click circles to build equal groups (like IXL Clicker Lab)
- "Pizza Fraction Slicer" - Click to slice pizza into equal parts, drag toppings
- "Pattern Block Studio" - Click tiles to create symmetrical patterns
- "Number Line Jumper" - Click arrows to jump along a number line to target
- "Array Constructor" - Build multiplication arrays by clicking grid cells
- "Balance Scale Game" - Drag weights to balance an equation

Keep the math simple and age-appropriate. Make it feel like a mini-game, not a worksheet!

Now output the response with <<<GAME>>> and <<<JOKE>>> delimiters:`;

    return prompt.trim();
}

function buildPrompt({ topic, subtopic, grade, variant }) {
    const topicLabel = subtopic || topic;

    const dna = `
You are a playful app generator for kids.Build ONE colorful, cartoon mini - app that feels unique and alive.
        Topic: "${topic}" ${subtopic ? `- Subtopic: "${subtopic}"` : ''} (Grade: ${grade || 'Elementary'
        }), variant: ${variant || 'default'}.

NON - NEGOTIABLE RULES
    - Output ONLY JSON.No prose, no backticks, no code fences.
- Never include quizzes, questions, options, or answers.This is not a Q & A quiz.
- Must be interactive: live visuals, click / drag style controls, instant feedback, celebratory message on success.
- Keep numbers small(3 - 12).Keep the tone vibrant and mischievous.
- Use one of the allowed types: "counter_adventure", "fraction_baker", "area_architect", "drag_drop_sorter", "number_line_jumper", or "shape_builder".

    SCHEMAS(choose exactly one)

TYPE "counter_adventure"
{
    "type": "counter_adventure",
        "title": "Fun label for the mini-app",
            "story": "Short playful story that mentions the topic",
                "target": 7,            // goal between 3 and 12
                    "initial": 0,
                        "min": -5,
                            "max": 12,
                                "itemName": "cartoon item kids collect",
                                    "itemEmoji": "🧪",
                                        "increments": [
                                            { "label": "Add 1", "delta": 1, "emoji": "➕", "color": "#22c55e" },
                                            { "label": "Subtract 1", "delta": -1, "emoji": "➖", "color": "#fb7185" },
                                            { "label": "Jump +3", "delta": 3, "emoji": "✨", "color": "#38bdf8" }
                                        ],
                                            "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon guide character"
    },
    "winMessage": "Cheerful line when target is reached"
}

TYPE "fraction_baker"
{
    "type": "fraction_baker",
        "title": "Playful fraction lab name",
            "story": "Cartoon story about baking/sharing slices",
                "targetFraction": { "numerator": 3, "denominator": 4 },
    "currentFraction": { "numerator": 1, "denominator": 4 },
    "controls": [
        { "label": "Add top", "numeratorDelta": 1, "emoji": "🍰", "color": "#22c55e" },
        { "label": "Remove top", "numeratorDelta": -1, "emoji": "🥄", "color": "#fb7185" },
        { "label": "Stretch bottom", "denominatorDelta": 1, "emoji": "🎈", "color": "#38bdf8" }
    ],
        "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon chef guide"
    },
    "winMessage": "Cheer when the fraction matches!"
}

TYPE "area_architect"
{
    "type": "area_architect",
        "title": "Architect lab name",
            "story": "Story about building rectangles for the topic",
                "targetProduct": 24,            // 6 to 48, small and kid-friendly
                    "grid": { "rows": 3, "cols": 4 },
    "controls": [
        { "label": "Add row", "deltaRow": 1, "emoji": "⬆", "color": "#22c55e" },
        { "label": "Remove row", "deltaRow": -1, "emoji": "⬇", "color": "#fb7185" },
        { "label": "Add column", "deltaCol": 1, "emoji": "➡", "color": "#38bdf8" },
        { "label": "Remove column", "deltaCol": -1, "emoji": "⬅", "color": "#facc15" }
    ],
        "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon builder guide"
    },
    "winMessage": "Cheer when rows x cols hits the target area!"
}

TYPE "drag_drop_sorter"
{
    "type": "drag_drop_sorter",
        "title": "Drag & Sort Challenge",
            "story": "Drag each item to its correct category!",
                "items": [
                    { "id": 1, "label": "2", "value": 2, "category": "even", "emoji": "🔵" },
                    { "id": 2, "label": "3", "value": 3, "category": "odd", "emoji": "🔴" },
                    { "id": 3, "label": "4", "value": 4, "category": "even", "emoji": "🔵" },
                    { "id": 4, "label": "7", "value": 7, "category": "odd", "emoji": "🔴" }
                ],
                    "categories": [
                        { "id": "even", "label": "Even Numbers", "color": "#3b82f6" },
                        { "id": "odd", "label": "Odd Numbers", "color": "#ef4444" }
                    ],
                        "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon sorting guide"
    },
    "winMessage": "Perfect sorting! All items in the right place!"
}

TYPE "number_line_jumper"
{
    "type": "number_line_jumper",
        "title": "Number Line Jump Adventure",
            "story": "Jump along the number line to reach your target!",
                "start": 0,
                    "target": 10,
                        "min": 0,
                            "max": 15,
                                "jumps": [
                                    { "label": "+1", "value": 1, "color": "#22c55e", "emoji": "→" },
                                    { "label": "+5", "value": 5, "color": "#3b82f6", "emoji": "⇒" },
                                    { "label": "-2", "value": -2, "color": "#ef4444", "emoji": "←" }
                                ],
                                    "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon jumper guide"
    },
    "winMessage": "Target reached! You're a number line champion!"
}

TYPE "shape_builder"
{
    "type": "shape_builder",
        "title": "Shape Building Challenge",
            "story": "Click pieces to build the target shape!",
                "targetShape": "rectangle",
                    "pieces": [
                        { "id": 1, "type": "square", "size": 2, "color": "#3b82f6" },
                        { "id": 2, "type": "square", "size": 2, "color": "#3b82f6" },
                        { "id": 3, "type": "triangle", "size": 1, "color": "#22c55e" },
                        { "id": 4, "type": "circle", "size": 1, "color": "#f97316" }
                    ],
                        "theme": {
        "background": "gradient string with bright kid-friendly colors",
            "panel": "#ffffff",
                "accent": "#f97316",
                    "success": "#22c55e",
                        "error": "#ef4444",
                            "character": "cartoon builder guide"
    },
    "winMessage": "Amazing! You built the perfect shape!"
}

TUNING FOR UNIQUENESS
    - Rotate type choice to keep outputs fresh.Try to vary between all 6 types.
- For drag_drop_sorter: create 3 - 6 items and 2 - 3 categories that relate to the topic
    - For number_line_jumper: choose start / target that make sense for the grade level
        - For shape_builder: pick 3 - 5 pieces that could combine into the target shape
            - Always include theme colors and a mascot character.
- Keep controls small and readable; avoid long text.
- Make the story and elements related to the topic!
`;

    return dna.trim();
}

function normalizeGameConfig(rawConfig, topicLabel) {
    if (!rawConfig || typeof rawConfig !== 'object') {
        return buildCounterFallback(topicLabel);
    }

    const bannedKeys = ['question', 'options', 'answer'];
    if (bannedKeys.some((k) => Object.prototype.hasOwnProperty.call(rawConfig, k))) {
        return buildCounterFallback(topicLabel);
    }

    const type = rawConfig.type;
    if (type === 'fraction_baker') {
        return normalizeFractionConfig(rawConfig, topicLabel);
    }
    if (type === 'area_architect') {
        return normalizeAreaConfig(rawConfig, topicLabel);
    }
    if (type === 'drag_drop_sorter') {
        return normalizeDragDropConfig(rawConfig, topicLabel);
    }
    if (type === 'number_line_jumper') {
        return normalizeNumberLineConfig(rawConfig, topicLabel);
    }
    if (type === 'shape_builder') {
        return normalizeShapeBuilderConfig(rawConfig, topicLabel);
    }
    return normalizeCounterConfig(rawConfig, topicLabel);
}

function normalizeCounterConfig(rawConfig, topicLabel) {
    const fallback = buildCounterFallback(topicLabel);
    const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

    const min = isNumber(rawConfig.min) ? rawConfig.min : fallback.min;
    const max = isNumber(rawConfig.max) ? rawConfig.max : fallback.max;
    const target = isNumber(rawConfig.target) ? clamp(rawConfig.target, min, max) : fallback.target;
    const initial = isNumber(rawConfig.initial) ? clamp(rawConfig.initial, min, max) : fallback.initial;

    const increments = Array.isArray(rawConfig.increments) && rawConfig.increments.length
        ? rawConfig.increments
            .filter((inc) => inc && typeof inc === 'object' && isNumber(inc.delta))
            .map((inc, idx) => ({
                label: inc.label || (inc.delta > 0 ? `Add ${inc.delta} ` : `Subtract ${Math.abs(inc.delta)} `),
                delta: clamp(inc.delta, -12, 12),
                emoji: inc.emoji || (inc.delta > 0 ? '➕' : '➖'),
                color: inc.color || (idx % 2 === 0 ? '#22c55e' : '#fb7185')
            }))
            .slice(0, 4)
        : fallback.increments;

    const theme = normalizeTheme(rawConfig.theme, fallback.theme);

    return {
        type: 'counter_adventure',
        title: rawConfig.title || `${topicLabel} Play Lab`,
        story: rawConfig.story || fallback.story,
        target,
        initial,
        min,
        max,
        itemName: rawConfig.itemName || fallback.itemName,
        itemEmoji: rawConfig.itemEmoji || fallback.itemEmoji,
        increments,
        theme,
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

function normalizeFractionConfig(rawConfig, topicLabel) {
    const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
    const fallback = buildFractionFallback(topicLabel);

    const targetNum = isNumber(rawConfig?.targetFraction?.numerator) ? clamp(rawConfig.targetFraction.numerator, -12, 12) : fallback.targetFraction.numerator;
    const targetDen = isNumber(rawConfig?.targetFraction?.denominator) ? clamp(rawConfig.targetFraction.denominator, 1, 12) : fallback.targetFraction.denominator;
    const currentNum = isNumber(rawConfig?.currentFraction?.numerator) ? clamp(rawConfig.currentFraction.numerator, -12, 12) : fallback.currentFraction.numerator;
    const currentDen = isNumber(rawConfig?.currentFraction?.denominator) ? clamp(rawConfig.currentFraction.denominator, 1, 12) : fallback.currentFraction.denominator;

    const controls = Array.isArray(rawConfig.controls) && rawConfig.controls.length
        ? rawConfig.controls
            .filter((c) => c && typeof c === 'object' && (isNumber(c.numeratorDelta) || isNumber(c.denominatorDelta)))
            .map((c, idx) => ({
                label: c.label || 'Adjust',
                numeratorDelta: isNumber(c.numeratorDelta) ? clamp(c.numeratorDelta, -5, 5) : 0,
                denominatorDelta: isNumber(c.denominatorDelta) ? clamp(c.denominatorDelta, -5, 5) : 0,
                emoji: c.emoji || '🍰',
                color: c.color || ['#22c55e', '#fb7185', '#38bdf8', '#facc15'][idx % 4]
            }))
            .slice(0, 4)
        : fallback.controls;

    const theme = normalizeTheme(rawConfig.theme, fallback.theme);

    return {
        type: 'fraction_baker',
        title: rawConfig.title || `${topicLabel} Slice Lab`,
        story: rawConfig.story || fallback.story,
        targetFraction: { numerator: targetNum, denominator: targetDen },
        currentFraction: { numerator: currentNum, denominator: currentDen },
        controls,
        theme,
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

function normalizeAreaConfig(rawConfig, topicLabel) {
    const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
    const fallback = buildAreaFallback(topicLabel);

    const targetProduct = isNumber(rawConfig.targetProduct) ? clamp(rawConfig.targetProduct, 4, 48) : fallback.targetProduct;
    const rows = isNumber(rawConfig?.grid?.rows) ? clamp(rawConfig.grid.rows, 1, 12) : fallback.grid.rows;
    const cols = isNumber(rawConfig?.grid?.cols) ? clamp(rawConfig.grid.cols, 1, 12) : fallback.grid.cols;

    const controls = Array.isArray(rawConfig.controls) && rawConfig.controls.length
        ? rawConfig.controls
            .filter((c) => c && typeof c === 'object' && (isNumber(c.deltaRow) || isNumber(c.deltaCol)))
            .map((c, idx) => ({
                label: c.label || 'Adjust',
                deltaRow: isNumber(c.deltaRow) ? clamp(c.deltaRow, -3, 3) : 0,
                deltaCol: isNumber(c.deltaCol) ? clamp(c.deltaCol, -3, 3) : 0,
                emoji: c.emoji || '🔲',
                color: c.color || ['#22c55e', '#fb7185', '#38bdf8', '#facc15'][idx % 4]
            }))
            .slice(0, 4)
        : fallback.controls;

    const theme = normalizeTheme(rawConfig.theme, fallback.theme);

    return {
        type: 'area_architect',
        title: rawConfig.title || `${topicLabel} Build Lab`,
        story: rawConfig.story || fallback.story,
        targetProduct,
        grid: { rows, cols },
        controls,
        theme,
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

function normalizeTheme(theme, fallback) {
    if (!theme || typeof theme !== 'object') return fallback;
    return {
        background: theme.background || fallback.background,
        panel: theme.panel || fallback.panel,
        accent: theme.accent || fallback.accent,
        success: theme.success || fallback.success,
        error: theme.error || fallback.error,
        character: theme.character || fallback.character,
    };
}

function buildCounterFallback(topicLabel) {
    return {
        type: 'counter_adventure',
        title: `${topicLabel} Play Lab`,
        story: `Build and balance numbers with ${topicLabel} !`,
        target: 7,
        initial: 0,
        min: -5,
        max: 12,
        itemName: 'number spark',
        itemEmoji: '🔢',
        increments: [
            { label: 'Add 1', delta: 1, emoji: '➕', color: '#22c55e' },
            { label: 'Subtract 1', delta: -1, emoji: '➖', color: '#fb7185' },
            { label: 'Jump +3', delta: 3, emoji: '✨', color: '#38bdf8' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Friendly robot guide'
        },
        winMessage: 'You reached the target!'
    };
}

function buildFractionFallback(topicLabel) {
    return {
        type: 'fraction_baker',
        title: `${topicLabel} Slice Lab`,
        story: `Match the slices to the ${topicLabel} target fraction!`,
        targetFraction: { numerator: 3, denominator: 4 },
        currentFraction: { numerator: 1, denominator: 4 },
        controls: [
            { label: 'Add top', numeratorDelta: 1, emoji: '🍰', color: '#22c55e' },
            { label: 'Remove top', numeratorDelta: -1, emoji: '🥄', color: '#fb7185' },
            { label: 'Stretch bottom', denominatorDelta: 1, emoji: '🎈', color: '#38bdf8' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Cartoon chef guide'
        },
        winMessage: 'Perfect slice match!'
    };
}

function buildAreaFallback(topicLabel) {
    return {
        type: 'area_architect',
        title: `${topicLabel} Build Lab`,
        story: `Design rectangles to hit the ${topicLabel} area target!`,
        targetProduct: 24,
        grid: { rows: 3, cols: 4 },
        controls: [
            { label: 'Add row', deltaRow: 1, emoji: '⬆', color: '#22c55e' },
            { label: 'Remove row', deltaRow: -1, emoji: '⬇', color: '#fb7185' },
            { label: 'Add column', deltaCol: 1, emoji: '➡', color: '#38bdf8' },
            { label: 'Remove column', deltaCol: -1, emoji: '⬅', color: '#facc15' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Cartoon builder guide'
        },
        winMessage: 'Area unlocked!'
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Normalization for drag_drop_sorter
function normalizeDragDropConfig(rawConfig, topicLabel) {
    const fallback = {
        type: 'drag_drop_sorter',
        title: `${topicLabel} Sorting Challenge`,
        story: 'Drag each item to the correct category!',
        items: [
            { id: 1, label: 'A', value: 1, category: 'cat1', emoji: '🔵' },
            { id: 2, label: 'B', value: 2, category: 'cat2', emoji: '🔴' }
        ],
        categories: [
            { id: 'cat1', label: 'Category 1', color: '#3b82f6' },
            { id: 'cat2', label: 'Category 2', color: '#ef4444' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Sorting guide'
        },
        winMessage: 'Perfect sorting!'
    };

    return {
        type: 'drag_drop_sorter',
        title: rawConfig.title || fallback.title,
        story: rawConfig.story || fallback.story,
        items: Array.isArray(rawConfig.items) ? rawConfig.items : fallback.items,
        categories: Array.isArray(rawConfig.categories) ? rawConfig.categories : fallback.categories,
        theme: normalizeTheme(rawConfig.theme, fallback.theme),
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

// Normalization for number_line_jumper
function normalizeNumberLineConfig(rawConfig, topicLabel) {
    const fallback = {
        type: 'number_line_jumper',
        title: `${topicLabel} Number Line`,
        story: 'Jump to the target!',
        start: 0,
        target: 10,
        min: 0,
        max: 15,
        jumps: [
            { label: '+1', value: 1, color: '#22c55e', emoji: '→' },
            { label: '-1', value: -1, color: '#ef4444', emoji: '←' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Jumper'
        },
        winMessage: 'Target reached!'
    };

    const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

    return {
        type: 'number_line_jumper',
        title: rawConfig.title || fallback.title,
        story: rawConfig.story || fallback.story,
        start: isNumber(rawConfig.start) ? rawConfig.start : fallback.start,
        target: isNumber(rawConfig.target) ? rawConfig.target : fallback.target,
        min: isNumber(rawConfig.min) ? rawConfig.min : fallback.min,
        max: isNumber(rawConfig.max) ? rawConfig.max : fallback.max,
        jumps: Array.isArray(rawConfig.jumps) && rawConfig.jumps.length ? rawConfig.jumps : fallback.jumps,
        theme: normalizeTheme(rawConfig.theme, fallback.theme),
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

// Normalization for shape_builder
function normalizeShapeBuilderConfig(rawConfig, topicLabel) {
    const fallback = {
        type: 'shape_builder',
        title: `${topicLabel} Shape Builder`,
        story: 'Build the shape!',
        targetShape: 'rectangle',
        pieces: [
            { id: 1, type: 'square', size: 2, color: '#3b82f6' },
            { id: 2, type: 'square', size: 2, color: '#3b82f6' }
        ],
        theme: {
            background: 'linear-gradient(135deg, #fef3c7, #e0f2fe)',
            panel: '#ffffff',
            accent: '#f97316',
            success: '#22c55e',
            error: '#ef4444',
            character: 'Builder'
        },
        winMessage: 'Shape complete!'
    };

    return {
        type: 'shape_builder',
        title: rawConfig.title || fallback.title,
        story: rawConfig.story || fallback.story,
        targetShape: rawConfig.targetShape || fallback.targetShape,
        pieces: Array.isArray(rawConfig.pieces) ? rawConfig.pieces : fallback.pieces,
        theme: normalizeTheme(rawConfig.theme, fallback.theme),
        winMessage: rawConfig.winMessage || fallback.winMessage
    };
}

function buildFallbackHTML(topicLabel) {
    return `< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${topicLabel} Play Lab</title>
                    <style>
                        * {margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font - family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 20px;
        }
                        .container {
                            background: white;
                        border-radius: 24px;
                        padding: 40px;
                        max-width: 500px;
                        width: 100%;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
                        h1 {
                            color: #667eea;
                        font-size: 32px;
                        margin-bottom: 10px;
                        text-align: center;
        }
                        .story {
                            color: #666;
                        text-align: center;
                        margin-bottom: 30px;
                        line-height: 1.6;
        }
                        .counter-display {
                            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        color: white;
                        font-size: 72px;
                        font-weight: bold;
                        text-align: center;
                        padding: 40px;
                        border-radius: 20px;
                        margin-bottom: 20px;
                        min-height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
        }
                        .buttons {
                            display: flex;
                        gap: 10px;
                        margin-bottom: 20px;
        }
                        button {
                            flex: 1;
                        padding: 20px;
                        font-size: 20px;
                        font-weight: bold;
                        border: none;
                        border-radius: 16px;
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                        color: white;
        }
                        button:hover {
                            transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
                        button:active {
                            transform: translateY(0);
        }
                        .btn-add {
                            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
                        .btn-subtract {
                            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
                        .success {
                            background: #10b981;
                        color: white;
                        padding: 20px;
                        border-radius: 16px;
                        text-align: center;
                        font-size: 20px;
                        font-weight: bold;
                        display: none;
                        animation: bounce 0.5s;
        }
                        .success.show {
                            display: block;
        }
                        @keyframes bounce {
                            0 %, 100 % { transform: scale(1); }
            50% {transform: scale(1.1); }
        }
                        .goal {
                            text - align: center;
                        color: #666;
                        margin-bottom: 20px;
                        font-size: 18px;
        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎮 ${topicLabel} Adventure!</h1>
                        <p class="story">Help count to the magic number! Click the buttons to add or subtract.</p>
                        <p class="goal">🎯 Goal: Reach <strong>10</strong></p>

                        <div class="counter-display" id="display">0</div>

                        <div class="buttons">
                            <button class="btn-add" onclick="changeCount(1)">➕ Add 1</button>
                            <button class="btn-add" onclick="changeCount(3)">✨ Add 3</button>
                        </div>
                        <div class="buttons">
                            <button class="btn-subtract" onclick="changeCount(-1)">➖ Subtract 1</button>
                            <button class="btn-add" onclick="changeCount(5)">🚀 Add 5</button>
                        </div>

                        <div class="success" id="success">
                            🎉 Amazing! You reached the goal! 🎉
                        </div>
                    </div>

                    <script>
                        let count = 0;
                        const target = 10;
                        const display = document.getElementById('display');
                        const success = document.getElementById('success');

                        function changeCount(delta) {
                            count += delta;
                        count = Math.max(0, Math.min(20, count));
                        display.textContent = count;

                        if (count === target) {
                            success.classList.add('show');
            } else {
                            success.classList.remove('show');
            }
        }
                    </script>
                </body>
            </html>`;
}

async function generateInfographicImage(topic, subtopic) {
    // Image generation is disabled on the free tier; keep returning null gracefully.
    console.log('Image generation skipped (not available on free tier)');
    return null;
}

module.exports = router;
