'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
	 await queryInterface.createTable('users', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.BIGINT
		},
		username: {
			type: Sequelize.STRING
		},
		display_name: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: null
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
    /**
     * Drop table users if migration failed.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
	 
	 await queryInterface.dropTable('users');
  }
};
