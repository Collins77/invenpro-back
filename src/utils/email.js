const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLowStockEmail = async (product) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_OWNER, // send to yourself for local setup
      subject: `Low Stock Alert - ${product.name}`,
      text: `Product ${product.name} is low in stock (${product.stock} units). Minimum required: ${product.minStock}`
    });
    console.log(`Low stock email sent for ${product.name}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendLowStockEmail };
