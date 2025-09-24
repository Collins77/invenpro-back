const db = require('../models');
const { sendLowStockEmail } = require('../utils/email');

const Product = db.Product;
const Stock = db.Stock;

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: Stock });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let { name, category, brand, sellingPrice, purchasePrice, stock, minStock, volume } = req.body;

    // Cast numeric fields properly
    sellingPrice = 1000;
    purchasePrice = 750;
    stock = parseInt(stock, 10) || 0;
    minStock = parseInt(minStock, 10) || 0;

    const product = await Product.create({
      name,
      category,
      brand,
      sellingPrice,
      purchasePrice,
      stock,
      minStock,
      volume,
      lastStocked: new Date()
    });

    console.log('Created product:', product);

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, details: err.errors });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { productId, quantity, unitCost, supplier, expiryDate, batchNumber, notes } = req.body;

    const stock = await Stock.create({ productId, quantity, unitCost, supplier, expiryDate, batchNumber, notes });

    const product = await Product.findByPk(productId);
    product.stock += parseInt(quantity);
    product.lastStocked = new Date();
    
    if(product.stock <= product.minStock) {
      await sendLowStockEmail(product);
      product.status = 'Low Stock';
    } else {
      product.status = 'Active';
    }

    await product.save();

    res.json({ stock, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
