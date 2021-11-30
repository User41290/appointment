var _ 		= require('underscore');
var model	= require('../models');
var sequelize = model.sequelize;

const db_err = {status_code: 1000, message: "DB operation is failed."};

exports.signup	= signup;
exports.login	= login;
exports.get_appt= get_appt;


async function signup(username, password, email, display_name){
	try{
		// 1. Check User exist
		var user = await get_user_by_username(username, true);
		if(user){
			throw ({status_code: 1001, message: "User already exists."});
		}
		// 2. Create user
		user = await create_user(username, password, email, display_name);
		
		return {user_id: user.id, display_name: user.display_name};
	}
	catch(err){
		throw err;
	}
}


async function login(username, password){
	try{
		// 1. Check User exist
		var user = await get_user_by_username(username);
		// 2. Match with user password
		await user.check_password(password);
		
		return {user_id: user.id, display_name: user.display_name};
	}
	catch(err){
		throw err;
	}
}


async function get_appt(user_id){
	try{
		// 1. Check User exist
		var appts_arr = await get_all_appointments(user_id);
		
		return appts_arr;
	}
	catch(err){
		throw err;
	}
}


// private function - find user
function get_user_by_username(username, is_signup = false){
	return new Promise(function(success, reject){
		// change to find or create
		model.users.findOne({where: {username: username, deleted_at: null}}).then(function(user){
			if(user){
				success(user);
			}
			else{
				if(is_signup){
					success(null);
				}
				else{
					reject({status_code: 1002, message: "User does not exist."});
				}
			}
		}).catch(function(err){
			console.log(err);
			reject({status_code: 1000, message: "Database error."});
		});
	});
}


// private function - create user
function create_user(username, password, email, display_name){
	return new Promise(function(success, reject){
		model.sequelize.transaction(function(t) {
			return model.users.create({username: username, password: password, email: email, display_name: display_name, created_at: new Date()}, {transaction: t}).then(function(user) {
				if(user){
					success(user);
				}
			}).catch(function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database error."});
			});
		});
	});
}


// private function - get all appointments of that user
function get_all_appointments(user_id){
	return new Promise(function(success, reject){
		var sql_query = "select appt.id, appt.date, appt.time_from, appt.time_to, d.display_name as designer from appointments appt inner join designers d on d.id = appt.designer_id where appt.is_cancel = 0 and appt.deleted_at is null and appt.user_id = "+user_id;
		
		sequelize.query(sql_query, {type: sequelize.QueryTypes.SELECT}).then(function(appt){
			if(appt.length > 0){
				success(appt);
			}else{
				success([]);
			}
		}).catch(function(err){
			console.log(err);
			res.send(db_err);
		});
		
	});
		
}