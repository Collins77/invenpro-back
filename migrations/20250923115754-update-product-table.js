'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns
    await queryInterface.addColumn('Products', 'sellingPrice', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Products', 'purchasePrice', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Products', 'volume', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove the description column
    await queryInterface.removeColumn('Products', 'description');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.removeColumn('Products', 'sellingPrice');
    await queryInterface.removeColumn('Products', 'purchasePrice');
    await queryInterface.removeColumn('Products', 'volume');
    await queryInterface.addColumn('Products', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
