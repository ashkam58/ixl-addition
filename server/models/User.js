const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true }, // Optional for now
    password: { type: String }, // Store plain text for now (demo), hash in production!
    name: { type: String, default: 'Guest' },
    subscribed: { type: Boolean, default: false },
    plan: { type: String, default: 'free' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('User', UserSchema);
