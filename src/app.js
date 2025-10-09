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
// CORS configuration
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:3000',
//   'https://invenpro.vercel.app', // Add your Vercel URL here after deployment
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (mobile apps, Postman, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

app.use(cors({
  origin: '*', // We'll update this after deploying frontend
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
