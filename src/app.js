const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const salesRoutes = require('./routes/salesRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: 'https://invenpro-front.vercel.app',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => res.send('Inventory API Running'));

module.exports = app;
