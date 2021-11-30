const { Op } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	const designers = sequelize.define('designers', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true // Automatically gets converted to SERIAL for postgres
		},
		display_name: {type: DataTypes.STRING},
		createdAt: {field: 'created_at',type: DataTypes.DATE},
		updatedAt: {field: 'updated_at',type: DataTypes.DATE},
		deleted_at: {type: DataTypes.DATE}
	}, {
		tableName: "designers"
	});
	
	return designers;
};
