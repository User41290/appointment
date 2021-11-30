'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
	 
	 await queryInterface.createTable('appointments', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.BIGINT
		},
		user_id: {
			type: Sequelize.BIGINT,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		designer_id: {
			type: Sequelize.BIGINT,
			allowNull: false,
			references: {
				model: 'designers',
				key: 'id'
			}
		},
		date: {
			type: Sequelize.DATEONLY
		},
		time_from: {
			type: Sequelize.INTEGER
		},
		time_to: {
			type: Sequelize.INTEGER
		},
		is_cancel: {
			type: Sequelize.BOOLEAN,
			defaultValue: 0
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
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
	 await queryInterface.dropTable('appointments');
  }
};
