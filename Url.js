const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    originalUrl: String,
    shortCode: { type: String, unique: true },
    expiryTime: Date,
    clicks: [{
        timestamp: Date,
        ip: String,
        source: String,
        location: String,
    }]
});

module.exports = mongoose.model('Url', UrlSchema);
