const mongoose = require('mongoose');

const AIContentSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    subtopic: { type: String },
    grade: { type: String },
    content: { type: Object, required: true }, // Stores the full JSON from Gemini
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Auto-delete after 7 days
});

// Compound index for fast lookups
AIContentSchema.index({ topic: 1, subtopic: 1, grade: 1 });

module.exports = mongoose.model('AIContent', AIContentSchema);
