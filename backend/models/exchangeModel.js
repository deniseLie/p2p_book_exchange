const mongoose = require('mongoose');

// Define Exchange Schema
const exchangeSchema = new mongoose.Schema({
    requesterUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerUserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requesterBookID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Multiple books can be exchanged
    ownerBookID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }],
    status: {
        type: String,
        enum: ['pending', 'denied', 'inprogress', 'halfApproved', 'canceled', 'completed'],
        default: 'pending'
    },
    exchangeDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Export the Exchange model
module.exports = mongoose.model('Exchange', exchangeSchema);
