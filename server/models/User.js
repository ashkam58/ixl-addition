const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true }, // Optional for now
    name: { type: String, default: 'Guest' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
