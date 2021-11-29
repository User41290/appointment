'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
	
	await queryInterface.bulkInsert('designers', [
		{
		  display_name: 'John',
		  created_at: new Date(),
		  updated_at: new Date()
		},
		{
		  display_name: 'Tan Ah Meng',
		  created_at: new Date(),
		  updated_at: new Date()
		}
	]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
	 
	 await queryInterface.bulkDelete('designers', null, {});
  }
};
