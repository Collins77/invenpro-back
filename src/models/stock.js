module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchasePrice: {
      type: DataTypes.FLOAT
    },
    sellingPrice: {
      type: DataTypes.FLOAT
    },
    vendor: {
      type: DataTypes.STRING
    },
    receiveDate: {
      type: DataTypes.DATE
    }
  });

  return Stock;
};
