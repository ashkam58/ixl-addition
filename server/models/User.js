const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    password: { type: String }, // Optional - not required for Google OAuth
    name: { type: String, default: 'Guest' },
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
    avatar: { type: String }, // Profile picture URL
    subscribed: { type: Boolean, default: false },
    plan: { type: String, default: 'free' },
    isPro: { type: Boolean, default: false }, // For subscription status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('User', UserSchema);
