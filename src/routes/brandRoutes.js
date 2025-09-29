const express = require('express');
const router = express.Router();
const { Brand, Product } = require('../models');

// Get all brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.json(brands);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new brand
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const brand = await Brand.create({ name, description });
        res.status(201).json(brand);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update brand
router.put('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: 'Brand not found' });

        const { name, description } = req.body;
        await brand.update({ name, description });
        res.json(brand);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete brand
router.delete('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) return res.status(404).json({ error: 'Brand not found' });

        // Check if any product is linked
        const productsUsingBrand = await Product.findOne({ where: { brandId: brand.id } });
        if (productsUsingBrand) {
            return res.status(400).json({ 
                error: 'Cannot delete brand. It is linked to one or more products.' 
            });
        }

        await brand.destroy();
        res.json({ message: 'Brand deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
