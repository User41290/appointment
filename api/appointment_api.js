var model 				= require("../models");
var sequelize 			= model.sequelize;
var joi 				= require('joi');
var _joi 				= require('../joi_validate')();
var _ 					= require('underscore');
var appointment_service = require("../services/appointment_service");

const db_err = {status_code: 1000, message: "DB operation is failed."};

exports.get_appt	= get_appointment;
exports.create_appt = create_appointment;
exports.update_appt	= update_appointment;
exports.cancel_appt = cancel_appointment;
exports.get_designer_list= get_designer_list;

function get_appointment(req, res){
	var result = joi.validate(req.query, _joi.joiAppointmentGet());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var designer_id = req.query.designer_id;
	
	appointment_service.get_appointment(designer_id).then(function(info){
		res.send({status_code: 0, data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});
}


function get_designer_list(req, res){
	appointment_service.get_designer_list().then(function(info){
		res.send({status_code: 0, data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});
}


function create_appointment(req, res){
	var result = joi.validate(req.body, _joi.joiAppointmentCreate());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var user_id 		= req.body.user_id;
	var designer_id 	= req.body.designer_id;
	var date 			= req.body.date;
	var time_from		= req.body.time_from;
	var time_to			= req.body.time_to;
	
	// 2. verify existence
	appointment_service.create_appointment(user_id, designer_id, date, time_from, time_to).then(function(info){
		res.send({status_code: 0, message: "Appointment has been created successfully", data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});

}


function update_appointment(req, res){
	var result = joi.validate(req.body, _joi.joiAppointmentUpdate());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var user_id 		= req.body.user_id;
	var appointment_id 	= req.body.appointment_id;
	var new_date 		= req.body.new_date;
	var new_time_from	= req.body.new_time_from;
	var new_time_to		= req.body.new_time_to;
	
	// 2. verify existence
	appointment_service.update_appointment(user_id, appointment_id, new_date, new_time_from, new_time_to).then(function(info){
		res.send({status_code: 0, message: "Appointment has been changed successfully", data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});

}


function cancel_appointment(req, res){
	var result = joi.validate(req.body, _joi.joiAppointmentCancel());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var appointment_id 		= req.body.appointment_id;
	var user_id 			= req.body.user_id;
	
	// 2. verify existence
	appointment_service.cancel_appointment(user_id, appointment_id).then(function(){
		res.send({status_code: 0, message: "Appointment has been deleted successfully"});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});

}


