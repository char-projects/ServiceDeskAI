const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    office: { type: String },
    status: { type: String, enum: ['open','assigned','in_progress', 'closed'], default: 'open' },
    media: [String],
    location: { lat: Number, lng: Number },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);