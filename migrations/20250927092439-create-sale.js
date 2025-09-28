'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sellingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      paymentType: {
        type: Sequelize.ENUM('Cash', 'Mpesa'),
        allowNull: false
      },
      customerType: {
        type: Sequelize.ENUM('Walk-In', 'Delivery'),
        allowNull: false
      },
      soldBy: {
        type: Sequelize.STRING,
        defaultValue: 'Admin'
      },
      saleDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sales');
  }
};
