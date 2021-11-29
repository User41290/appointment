'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
	 
	 await queryInterface.createTable('designers', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.BIGINT
		},
		display_name: {
			type: Sequelize.STRING
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE

		},
		updated_at: {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null
		},
		deleted_at: {
			allowNull: true,
			type: Sequelize.DATE,
			defaultValue: null
		}
	});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('designers');
  }
};
