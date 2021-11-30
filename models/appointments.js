const { Op } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	const appointments = sequelize.define('appointments', {
		user_id: {type: DataTypes.BIGINT},
		designer_id: {type: DataTypes.BIGINT},
		date: {type: DataTypes.DATEONLY},
		time_from: {type: DataTypes.INTEGER},
		time_to: {type: DataTypes.INTEGER},
		is_cancel: {type: DataTypes.BOOLEAN},
		createdAt: {field: 'created_at',type: DataTypes.DATE},
		updatedAt: {field: 'updated_at',type: DataTypes.DATE},
		deleted_at: {type: DataTypes.DATE}
	}, {
		tableName: "appointments"
	});
	
	
	appointments.prototype.cancel = function(){
		var that = this;
		return new Promise(function(success, reject){
			that.set({
				is_cancel: 1,
				updated_at: new Date()
			})
			.save().then(function(self){
				success();
			}, function(err){
				reject ({status_code: 1038, message: "Database error."});
			});
		});
	};
	
	
	appointments.prototype.update = function(new_date, new_time_from, new_time_to){
		var that = this;
		return new Promise(function(success, reject){
			that.set({
				date: new_date,
				time_from: new_time_from,
				time_to: new_time_to,
				updated_at: new Date()
			})
			.save().then(function(self){
				success();
			}, function(err){
				reject ({status_code: 1038, message: "Database error."});
			});
		});
	}
	
	
	return appointments;
};
