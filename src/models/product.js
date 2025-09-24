module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    minStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    volume: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    },
    lastStocked: {
      type: DataTypes.DATE
    }
  });

  return Product;
};
