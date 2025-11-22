const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true },
    skillId: { type: String, required: true },
    smartScoreHistory: [Number], // Track score over time
    currentScore: { type: Number, default: 0 },
    totalAnswered: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
ProgressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
