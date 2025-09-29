module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brandId: {
      type: DataTypes.INTEGER,
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

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(models.Brand, { foreignKey: 'brandId', as: 'brand' });
  };

  return Product;
};
