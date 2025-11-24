const mongoose = require('mongoose');

const AIContentSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    subtopic: { type: String },
    grade: { type: String },
    content: { type: Object, required: true }, // Stores the full JSON/HTML from Gemini
    createdAt: { type: Date, default: Date.now }, // Permanent storage (removed expires)

    // Library Features
    title: { type: String },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    // New Feature
    joke: { type: String } // Stores the interactive joke HTML
});

// Compound index for fast lookups
AIContentSchema.index({ topic: 1, subtopic: 1, grade: 1 });

module.exports = mongoose.model('AIContent', AIContentSchema);
