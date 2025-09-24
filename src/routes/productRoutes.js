const express = require('express');
const router = express.Router();
const { Product, Stock } = require('../models');

// Get all products (with optional search and filter)
router.get('/', async (req, res) => {
    try {
        const { search, category, status } = req.query;
        let where = {};

        if (search) {
            where = {
                ...where,
                name: { [require('sequelize').Op.iLike]: `%${search}%` }
            };
        }
        if (category && category !== 'all') where.category = category;
        if (status && status !== 'all') where.status = status;

        const products = await Product.findAll({
            where,
            include: Stock
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: Stock });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, category, brand, sellingPrice, purchasePrice, stock, minStock, volume } = req.body;
        const product = await Product.create({
            name, category, brand, sellingPrice, purchasePrice, stock, minStock, volume,
            status: stock <= minStock ? 'Low Stock' : 'Active',
            dateAdded: new Date(),
            lastStocked: new Date()
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { name, category, brand, price, stock, minStock, description, status } = req.body;

        await product.update({ name, category, brand, price, stock, minStock, description, status });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add stock to product
router.post('/:id/stock', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { quantity, purchasePrice, sellingPrice, vendor, receiveDate } = req.body;

    // Add stock entry
    const stockEntry = await Stock.create({
      productId: product.id,
      quantity,
      purchasePrice,
      sellingPrice,
      vendor,
      receiveDate
    });

    // Update product stock
    const newStock = product.stock + parseInt(quantity, 10);

    // Update product (prices only if provided)
    await product.update({
      stock: newStock,
      ...(purchasePrice ? { purchasePrice } : {}),
      ...(sellingPrice ? { sellingPrice } : {}),
      status: newStock <= product.minStock ? 'Low Stock' : 'Active',
      lastStocked: new Date()
    });

    res.status(201).json({ product, stockEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
