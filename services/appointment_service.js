var _ 						= require('underscore');
var model					= require('../models');
const { Op } 				= require("sequelize");
var sequelize				= model.sequelize;

exports.create_appointment	= create_appointment;
exports.get_appointment		= get_appointment;
exports.cancel_appointment	= cancel_appointment;
exports.update_appointment	= update_appointment;
exports.get_designer_list	= get_designer_list;

const db_err 				= {status_code: 1000, message: "DB operation is failed."};

async function create_appointment(user_id, designer_id, date, time_from, time_to){
	try{
		// 1. Check designer exists
		var designer 	= await get_designer(designer_id);
		// 2. Check user exists
		var user 		= await get_user(user_id);
		// 3. Check appointment available
		var appts_arr 	= await filter_appointment(designer_id, date, time_from, time_to);
		if(appts_arr.length > 0){
			throw ({status_code: 1004, message: "Not available for appointment."});
		}
		// 4. Create appointment
		var appt 		= await add_appointment(designer_id, user_id, date, time_from, time_to);
		
		return appt;
	}
	catch(err){
		throw err;
	}
}


async function get_appointment(designer_id){
	try{
		// 1. Get appointment for particular designer
		var appts_arr = await filter_appointment(designer_id);
		
		return appts_arr;
	}
	catch(err){
		throw err;
	}
}


async function get_designer_list(){
	try{
		// 1. Get Designer List
		var designer_arr = await get_all_designer();
		
		return designer_arr;
	}
	catch(err){
		throw err;
	}
}


async function cancel_appointment(user_id, appointment_id){
	try{
		// 1. Get appointment
		var appt = await get_appointment_by_id(appointment_id);
		// 2. Check if same person made the cancel appointment
		if(appt.user_id != user_id){
			throw ({status_code: 1004, message: "Invalid credentials. Please contact admin to change this appointment."})
		}
		// 3.Update the status of that appointment
		await appt.cancel();
		return;
	}
	catch(err){
		throw err;
	}
}


async function update_appointment(user_id, appointment_id, new_date, new_time_from, new_time_to){
	try{
		// 1. Get appointment
		var appt = await get_appointment_by_id(appointment_id);
		// 2. Check if same person made the cancel appointment
		if(appt.user_id != user_id){
			throw ({status_code: 1004, message: "Invalid credentials. Please contact admin to change this appointment."})
		}
		// 3. Check if the new appointment is available
		var appts_arr 	= await filter_appointment(appt.designer_id, new_date, new_time_from, new_time_to);
		if(appts_arr.length > 0){
			throw ({status_code: 1004, message: "Not available for appointment."});
		}
		// 4.Update the new date new time of that appointment
		await appt.update(new_date, new_time_from, new_time_to);
		return appt;
	}
	catch(err){
		throw err;
	}
}

// private function - get particular designer appointment info
function get_appointment_by_id(appt_id){
	return new Promise(function(success, reject){
		model.appointments.findOne({where: {id: appt_id, is_cancel: 0, deleted_at: null}}).then(function(appt){
			if(appt){
				success(appt);
			}
			else{
				reject({status_code: 1002, message: "Appointment does not exist."});
			}
		}).catch(function(err){
			console.log(err);
			reject({status_code: 1000, message: "Database error."});
		});
	});
}

// private function - get particular designer appointment info
function filter_appointment(designer_id = null, date = null, time_from = null, time_to = null){
	return new Promise(function(success, reject){
		var sql_query = "select * from appointments where is_cancel=0 and deleted_at is null";
		if(designer_id)
			sql_query += " and designer_id = "+designer_id;
		if(date)
			sql_query += " and date='"+date+"'";
		if(time_from)
			sql_query += " and ("+time_from+" between time_from and time_to-1 or "+time_to+" between time_from+1 and time_to)";
		
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


// private function - create appointment
function add_appointment(designer_id, user_id, date, time_from, time_to){
	return new Promise(function(success, reject){
		model.sequelize.transaction(function(t) {
			return model.appointments.create({designer_id: designer_id, user_id: user_id, date: date, time_from: time_from, time_to: time_to, created_at: new Date()}, {transaction: t}).then(function(appt) {
				if(appt){
					success(appt);
				}
			}).catch(function(err){
				console.log(err);
				reject({status_code: 1038, message: "Database error."});
			});
		});
	});
}


// private function - check designer exists
function get_designer(designer_id){
	return new Promise(function(success, reject){
		model.designers.findOne({where: {id: designer_id, deleted_at: null}}).then(function(designer){
			if(designer){
				success(designer);
			}
			else{
				reject({status_code: 1004, message: "Designer does not exist."});
			}
		}).catch(function(err){
			console.log(err);
			reject(db_err);
		});
	});
}


// private function - check user exists
function get_user(user_id){
	return new Promise(function(success, reject){
		model.users.findOne({where: {id: user_id, deleted_at: null}}).then(function(user){
			if(user){
				success(user);
			}
			else{
				reject({status_code: 1004, message: "User does not exist."});
			}
		}).catch(function(err){
			console.log(err);
			reject(db_err);
		});
	});
}


// private function - get designer list
function get_all_designer(){
	return new Promise(function(success, reject){
		model.designers.findAll({where: {deleted_at: null}}).then(function(designers_arr){
			if(designers_arr.length > 0){
				success(designers_arr);
			}
			else{
				success([]);
			}
		}).catch(function(err){
			console.log(err);
			reject({status_code: 1000, message: "Database error."});
		});
	});
}