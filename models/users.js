const { Op } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	const users = sequelize.define('users', {
		username: {type: DataTypes.STRING},
		display_name: {type: DataTypes.STRING},
		password: {type: DataTypes.STRING},
		email: {type: DataTypes.STRING},
		createdAt: {field: 'created_at',type: DataTypes.DATE},
		updatedAt: {field: 'updated_at',type: DataTypes.DATE},
		deleted_at: {type: DataTypes.DATE}
	}, {
		tableName: "users"
	});
	
	
	users.prototype.check_password = function(password){
		var that = this;
		return new Promise(function(success, reject){
			sequelize.models.users.findOne({where: {id: that.id, password: password}}).then(function(user){
				if(user){
					success(user);
				}
				else{
					reject({status_code: 1000, message: "Invalid credential."});
				}
				
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	
	users.prototype.get_game_favlist = function(){
		var that = this;
		
		return new Promise(function(success, reject){
			sequelize.models.fav_gamelist.findOrCreate({where: {member_id: that.id, deleted_at: null}, defaults: {member_id: that.id, fav_list: '[]'}}).spread(function(list, created){
				if(list){
					success(list);
				}
				else{
					reject({status_code: 1000, message: "Invalid credential."});
				}
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	
	users.prototype.update_game_favlist = function(list){
		var that = this;
		var list_str = JSON.stringify(list);
		
		return new Promise(function(success, reject){
			sequelize.models.fav_gamelist.update(
			{
				fav_list: list_str,
				updated_at: new Date()
			}, 
			{
				where: {deleted_at: null, member_id: that.id}
			})
			.then(function(result){
				success();
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	
	users.prototype.update_access_token = function(new_access_token){
		var that = this;
		return new Promise(function(success, reject){
			// set previous remember_token as last session
			var last_session 	= that.remember_token;
			var remember_token 	= new_access_token;
			
			that.set({last_session: last_session, remember_token: remember_token, updated_at: new Date()})
			.save().then(function(self){
				success();
			}, function(err){
				reject ({status_code: 1038, message: "Database error."});
			});
		});
	}
	
	
	users.prototype.update_info = function(type, value){
		var that = this;
		return new Promise(function(success, reject){
			var params = {};
			params[type] = value;
			params['updated_at'] = new Date();
			
			that.set(params)
			.save().then(function(self){
				success();
			}, function(err){
				reject ({status_code: 1038, message: "Database error."});
			});
		});
	}
	
	
	users.prototype.get_member_login_log = function(){
		var that = this;
		
		return new Promise(function(success, reject){
			sequelize.models.member_login_log.findOrCreate({where: {member_id: that.id}, defaults: {member_id: that.id}}).spread(function(log, created){
				if(log){
					success(log);
				}
				else{
					reject({status_code: 1000, message: "Invalid credential."});
				}
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	
	users.prototype.insert_login_session = function(ip_address, app_version){
		var that = this;
		
		return new Promise(function(success, reject){
			sequelize.models.members_login_session.create({member_id: that.id, ip_address: ip_address, app_version: app_version}).then(function(login_log){
				if(login_log){
					success();
				}
				else{
					reject({status_code: 1000, message: "Invalid credential."});
				}
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	
	users.prototype.get_login_session = function(date){
		var that = this;
		
		return new Promise(function(success, reject){
			sequelize.models.members_login_session.findAll({where: {member_id: that.id, login_date: {[Op.gte]: date}}}).then(function(login_session){
				if(login_session.length > 0){
					success(login_session.length);
				}
				else{
					success(0);
				}
				
			}, function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database Error."});
			});
		});
	}
	
	return users;
};
