var model 		= require("../models");
var sequelize 	= model.sequelize;
var joi 		= require('joi');
var _joi 		= require('../joi_validate')();
var _ 			= require('underscore');
var user_service= require("../services/user_service");
var crypto 		= require("crypto");

const db_err 	= {status_code: 1000, message: "DB operation is failed."};

exports.signup 	= signup;
exports.login 	= login;
exports.get_appt= get_appt;

function signup(req, res){
	var result = joi.validate(req.body, _joi.joiUserSignUp());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var username 	= req.body.username;
	var password 	= encrypt_password(req.body.password);
	var email 		= req.body.email;
	var display_name= req.body.display_name;
	
	// 2. verify existence
	user_service.signup(username, password, email, display_name).then(function(info){
		res.send({status_code: 0, message: "User has been created successfully", data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});

}


function login(req, res){
	var result = joi.validate(req.body, _joi.joiUserLogin());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	
	var username 	= req.body.username;
	var password 	= encrypt_password(req.body.password);
	
	// 2. verify existence
	user_service.login(username, password).then(function(info){
		res.send({status_code: 0, message: "Login successfully", data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});
}


function get_appt(req, res){
	var result = joi.validate(req.body, _joi.joiUserGetAppointment());
	if(result.error){
		console.log(result.error['details'][0]["message"]);
		var message = {status_code: 1004, message: result.error['details'][0]['message']};
		res.send(message);
		return;
	}
	var user_id = req.body.user_id;
	user_service.get_appt(user_id).then(function(info){
		res.send({status_code: 0, data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});
}


// private function - encrypt password
function encrypt_password(password){
	var encrypt_pass = password;
	return crypto.createHash('md5').update(encrypt_pass).digest('hex');
}