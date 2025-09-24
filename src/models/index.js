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

db.Product = require('./product')(sequelize, Sequelize);
db.Stock = require('./stock')(sequelize, Sequelize);

db.Product.hasMany(db.Stock, { foreignKey: 'productId' });
db.Stock.belongsTo(db.Product, { foreignKey: 'productId' });

module.exports = db;
