module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    paymentType: {
      type: DataTypes.ENUM("Cash", "Mpesa"),
      allowNull: false,
    },
    customerType: {
      type: DataTypes.ENUM("Walk-In", "Delivery"),
      allowNull: false,
    },
    receiptPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    soldBy: {
      type: DataTypes.STRING,
      defaultValue: "Admin",
    },
    saleDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Sale.associate = (models) => {
    Sale.hasMany(models.SaleItem, { foreignKey: "saleId", as: "items" });
  };

  return Sale;
};
