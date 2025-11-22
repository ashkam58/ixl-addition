const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');

// GET /api/questions
// Mock response for now, or could load from JSON files
router.get('/questions', (req, res) => {
    const { grade, skillId } = req.query;
    // In a real app, query DB or load specific JSON file
    res.json({ message: `Questions for Grade ${grade}, Skill ${skillId}` });
});

// POST /api/progress
router.post('/progress', async (req, res) => {
    try {
        const { userId, grade, skillId, score, answeredCount } = req.body;

        // Find or create progress doc
        let progress = await Progress.findOne({ userId, grade, skillId });

        if (!progress) {
            progress = new Progress({ userId, grade, skillId });
        }

        progress.currentScore = score;
        progress.totalAnswered = answeredCount;
        progress.smartScoreHistory.push(score);

        await progress.save();
        res.json({ success: true, progress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// GET /api/progress
router.get('/progress', async (req, res) => {
    try {
        const { userId } = req.query;
        const progress = await Progress.find({ userId });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

module.exports = router;
