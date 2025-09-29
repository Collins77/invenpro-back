'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      brandId: {
        type: Sequelize.INTEGER,
        references: { model: 'Brands', key: 'id' },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      sellingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      purchasePrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      minStock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      volume: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active'
      },
      lastStocked: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  }
};
