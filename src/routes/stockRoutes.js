const express = require('express');
const router = express.Router();
const { Stock, Product } = require('../models');

// Get all stock entries
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.findAll({ include: Product });
        res.json(stocks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single stock entry
router.get('/:id', async (req, res) => {
    try {
        const stock = await Stock.findByPk(req.params.id, { include: Product });
        if (!stock) return res.status(404).json({ error: 'Stock entry not found' });
        res.json(stock);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete stock entry
router.delete('/:id', async (req, res) => {
    try {
        const stock = await Stock.findByPk(req.params.id);
        if (!stock) return res.status(404).json({ error: 'Stock entry not found' });

        await stock.destroy();
        res.json({ message: 'Stock entry deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
