const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.Product = require('./product')(sequelize, Sequelize);
db.Stock = require('./stock')(sequelize, Sequelize);
db.Sale = require('./sale')(sequelize, Sequelize);
db.SaleItem = require('./saleItem')(sequelize, Sequelize);

// Associations

// Product <-> Stock
db.Product.hasMany(db.Stock, { foreignKey: 'productId' });
db.Stock.belongsTo(db.Product, { foreignKey: 'productId' });

// Sale <-> SaleItem
db.Sale.hasMany(db.SaleItem, { foreignKey: 'saleId', as: 'items' });
db.SaleItem.belongsTo(db.Sale, { foreignKey: 'saleId' });

// Product <-> SaleItem
db.Product.hasMany(db.SaleItem, { foreignKey: 'productId' });
db.SaleItem.belongsTo(db.Product, { foreignKey: 'productId' });

module.exports = db;
