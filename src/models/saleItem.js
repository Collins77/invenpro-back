module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define("SaleItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0 },
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  SaleItem.associate = (models) => {
    SaleItem.belongsTo(models.Product, { foreignKey: "productId" });
    SaleItem.belongsTo(models.Sale, { foreignKey: "saleId" });
  };

  return SaleItem;
};
