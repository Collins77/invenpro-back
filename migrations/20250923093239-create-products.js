'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      brand: { type: Sequelize.STRING, allowNull: false },
      sellingPrice: { type: Sequelize.FLOAT, allowNull: false },
      purchasePrice: { type: Sequelize.FLOAT, allowNull: false },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      minStock: { type: Sequelize.INTEGER, defaultValue: 0 },
      volume: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 'Active' },
      lastStocked: { type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
