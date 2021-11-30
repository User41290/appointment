var express 		= require('express');
var router 			= express.Router();
var model 			= require("../models");
var _ 				= require('underscore');
var appointment_api = require("../api/appointment_api");
var user_api 		= require("../api/user_api");


router.use(function(req,res, next){
	var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
	next();
});


router.get('/appointment/get', function(req, res) {
	console.log("--- Get Appointment ---");
	console.log(req.query);
	appointment_api.get_appt(req, res);
});


router.post('/appointment/create', function(req, res) {
	console.log("--- Create Appointment API ---");
	console.log(req.body);
	appointment_api.create_appt(req, res);
});


router.post('/appointment/cancel', function(req, res) {
	console.log("--- Cancel Appointment API ---");
	console.log(req.body);
	appointment_api.cancel_appt(req, res);
});


router.post('/appointment/update', function(req, res) {
	console.log("--- Update Appointment API ---");
	console.log(req.body);
	appointment_api.update_appt(req, res);
});


router.post('/user/signup', function(req, res) {
	console.log("--- Sign Up API ---");
	console.log(req.body);
	user_api.signup(req, res);
});


router.post('/user/login', function(req, res) {
	console.log("--- Login API ---");
	console.log(req.body);
	user_api.login(req, res);
});

module.exports = router;