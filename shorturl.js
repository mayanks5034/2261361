const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

// POST - Create short URL
router.post('/', async (req, res) => {
    const { url, shortcode, validity } = req.body;
    let shortCodeFinal = shortcode || generateShortCode();
    const expiry = new Date(Date.now() + (validity || 30) * 60 * 1000);

    try {
        const existing = await Url.findOne({ shortCode: shortCodeFinal });
        if (existing) return res.status(400).json({ error: "Shortcode already exists" });

        const newUrl = new Url({
            originalUrl: url,
            shortCode: shortCodeFinal,
            expiryTime: expiry
        });

        await newUrl.save();
        res.status(201).json({
            shortLink: `http://localhost:5000/shorturls/${shortCodeFinal}`,
            expiry: expiry.toISOString()
        });

    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// GET - Redirect
router.get('/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    try {
        const record = await Url.findOne({ shortCode: shortcode });
        if (!record) return res.status(404).json({ error: "Shortcode not found" });

        if (new Date() > record.expiryTime) return res.status(410).json({ error: "Link expired" });

        // Save click stats (simplified)
        record.clicks.push({
            timestamp: new Date(),
            ip: req.ip,
            source: req.headers['user-agent'],
            location: 'India' // You can improve this with IP lookup APIs
        });
        await record.save();

        res.redirect(record.originalUrl);
    } catch (err) {
        res.status(500).json({ error: "Error in redirection" });
    }
});

// GET - Stats
router.get('/stats/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    try {
        const record = await Url.findOne({ shortCode: shortcode });
        if (!record) return res.status(404).json({ error: "Shortcode not found" });

        res.json({
            originalUrl: record.originalUrl,
            createdAt: record._id.getTimestamp(),
            expiry: record.expiryTime,
            clicks: record.clicks.length,
            details: record.clicks
        });
    } catch (err) {
        res.status(500).json({ error: "Error in stats" });
    }
});

module.exports = router;
