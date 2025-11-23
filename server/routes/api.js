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

// POST /api/auth/signup
router.post('/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        res.json({ success: true, user });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password (simple comparison for demo)
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/users/upsert
router.post('/users/upsert', async (req, res) => {
    try {
        const { email, name } = req.body;
        let user;

        if (email) {
            user = await User.findOne({ email });
        }

        if (!user && name) {
            user = await User.findOne({ name, email: { $exists: false } });
        }

        if (!user) {
            user = new User({ email, name });
        } else {
            if (name) user.name = name;
            if (email) user.email = email;
        }

        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        console.error('--------------------------------------------------');
        console.error('UPSERT ERROR:', err.message);
        console.error('Full Error:', err);
        console.error('--------------------------------------------------');
        res.status(500).json({ error: 'Failed to upsert user' });
    }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST /api/users/:id/subscribe
router.post('/users/:id/subscribe', async (req, res) => {
    try {
        const { plan = 'pro' } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.subscribed = true;
        user.plan = plan;
        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update subscription' });
    }
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
