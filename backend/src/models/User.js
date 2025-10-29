const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['standard','services','admin'], default: 'standard' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);