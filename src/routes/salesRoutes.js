const express = require("express");
const router = express.Router();
const { Sale, Product, SaleItem, sequelize } = require("../models");
const { sendLowStockEmail } = require("../utils/email");
const { generateReceipt } = require("../utils/receipt");

// Create a new sale with multiple products
// router.post("/", async (req, res) => {
//   try {
//     const { items, discount = 0, paymentType = "Cash", customerType = "Walk-In" } = req.body;

//     // Validate payment & customer types
//     const paymentOptions = ["Cash", "MPESA"];
//     const customerOptions = ["Walk-In", "Delivery"];
//     if (!paymentOptions.includes(paymentType)) return res.status(400).json({ error: "Invalid payment type" });
//     if (!customerOptions.includes(customerType)) return res.status(400).json({ error: "Invalid customer type" });

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: "No products selected" });
//     }

//     if (discount < 0) return res.status(400).json({ error: "Discount cannot be negative" });

//     let totalAmount = 0;
//     const saleItems = [];

//     for (const item of items) {
//       const { productId, quantity } = item;

//       if (quantity <= 0) return res.status(400).json({ error: "Quantity must be positive" });

//       const product = await Product.findByPk(productId);
//       if (!product) return res.status(404).json({ error: `Product not found: ID ${productId}` });

//       if (product.stock < quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

//       const itemTotal = product.sellingPrice * quantity;
//       totalAmount += itemTotal;

//       saleItems.push({ productId, quantity, sellingPrice: product.sellingPrice, total: itemTotal });

//       // Update stock
//       const newStock = product.stock - quantity;
//       await product.update({
//         stock: newStock,
//         status: newStock <= product.minStock ? "Low Stock" : "Active",
//       });

//       if (newStock <= product.minStock) {
//         await sendLowStockEmail(product);
//       }
//     }

//     // Apply discount
//     totalAmount -= discount;

//     // Create sale
//     const sale = await Sale.create({
//       discount,
//       totalAmount,
//       paymentType,
//       customerType,
//       receiptPath: null,
//       soldBy: "Admin",
//       saleDate: new Date(),
//     });

//     // Create sale items
//     for (const item of saleItems) {
//       await SaleItem.create({
//         saleId: sale.id,
//         productId: item.productId,
//         quantity: item.quantity,
//         sellingPrice: item.sellingPrice,
//         subtotal: item.total,

//       });
//     }

//     const receiptPath = await generateReceipt(sale, saleItems);
//     await sale.update({ receiptPath });

//     // Generate receipt
//     // generateReceipt(sale, saleItems, res);
//     res.json({
//       message: "Sale confirmed!",
//       sale: sale,           // includes receiptPath
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.post("/", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, discount = 0, paymentType = "Cash", customerType = "Walk-In" } = req.body;

    // Validate payment & customer types
    const paymentOptions = ["Cash", "MPESA"];
    const customerOptions = ["Walk-In", "Delivery"];
    if (!paymentOptions.includes(paymentType)) throw new Error("Invalid payment type");
    if (!customerOptions.includes(customerType)) throw new Error("Invalid customer type");
    if (!Array.isArray(items) || items.length === 0) throw new Error("No products selected");
    if (discount < 0) throw new Error("Discount cannot be negative");

    let totalAmount = 0;
    const saleItems = [];

    // Validate products and calculate totals
    for (const item of items) {
      const { productId, quantity } = item;
      if (quantity <= 0) throw new Error("Quantity must be positive");

      const product = await Product.findByPk(productId, { transaction: t });
      if (!product) throw new Error(`Product not found: ID ${productId}`);
      if (product.stock < quantity) throw new Error(`Insufficient stock for ${product.name}`);

      const itemTotal = product.sellingPrice * quantity;
      totalAmount += itemTotal;
      saleItems.push({ productId, quantity, sellingPrice: product.sellingPrice, total: itemTotal });

      // Update stock
      const newStock = product.stock - quantity;
      await product.update(
        {
          stock: newStock,
          status: newStock <= product.minStock ? "Low Stock" : "Active",
        },
        { transaction: t }
      );

      if (newStock <= product.minStock) await sendLowStockEmail(product);
    }

    totalAmount -= discount;

    // Create sale
    const sale = await Sale.create(
      {
        discount,
        totalAmount,
        paymentType,
        customerType,
        receiptPath: null,
        soldBy: "Admin",
        saleDate: new Date(),
      },
      { transaction: t }
    );

    // Create sale items
    for (const item of saleItems) {
      await SaleItem.create(
        {
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          subtotal: item.total,
        },
        { transaction: t }
      );
    }

    // Commit transaction first
    await t.commit();

    // Generate receipt AFTER commit
    let receiptPath = null;
    try {
      receiptPath = await generateReceipt(sale, saleItems);
      await sale.update({ receiptPath });
    } catch (err) {
      console.error("Receipt generation failed:", err);
    }

    res.json({
      message: "Sale confirmed!",
      sale: {
        ...sale.toJSON(),
        receiptPath, // send path to frontend
      },
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(400).json({ error: err.message || "Server error" });
  }
});

// Get all sales with products
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: { model: SaleItem, include: Product, as: "items" },
      order: [["saleDate", "DESC"]],
    });
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single sale
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: { model: SaleItem, include: Product, as: "items" },
    });
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
