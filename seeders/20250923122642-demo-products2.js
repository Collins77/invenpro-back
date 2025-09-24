'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      { name: 'Tusker Lager', category: 'Beer', brand: 'EABL', sellingPrice: 350, purchasePrice: 300, stock: 50, minStock: 10, volume: '500ML', status: 'Active', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Coca-Cola', category: 'Soft Drink', brand: 'Coca-Cola', sellingPrice: 120, purchasePrice: 80, stock: 100, minStock: 20, volume: '330ML', status: 'Active', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
