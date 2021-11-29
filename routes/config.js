var app 	= require('express')();
var express = require('express');
var router	= express.Router();
var fs 		= require('fs');
const path 	= require('path');

function saveJsonFile(filename, data, callback) {
	fs.writeFile(filename, JSON.stringify(data), callback);
}


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


router.post('/save', function(req, res) {
	if(!req.body.json_data || !req.body.type){
		res.send({status_code: 1004, message: "Invalid data format."});
		return;
	}
	var json_data = req.body.json_data;
	var type = req.body.type;
	var filename = "mfcs_config";
	
	if(type == "backup"){
		filename = filename +"_"+ Date.now().toString();
	}
	
	filename += ".json";
	
	saveJsonFile(filename, json_data,  function(err) {
		if (err) {
			res.send({status_code: 1004, message: err});
			return;
		}
		res.send({status_code: 0, message: "Successfully saved.", data: filename});
	});
	
});


router.post('/save/users', function(req, res) {
	if(!req.body.json_data){
		res.send({status_code: 1004, message: "Invalid data format."});
		return;
	}
	var json_data = req.body.json_data;
	var filename = "user_arr.json";
	
	saveJsonFile(filename, json_data,  function(err) {
		if (err) {
			res.send({status_code: 1004, message: err});
			return;
		}
		res.send({status_code: 0, message: "Successfully saved."});
	});
	
});


router.post('/arrangement', function(req, res){
	const folderPath 	= "./arrangement";
	var arrangement_arr 		= fs.readdirSync(folderPath);
	
	var temp_arr = [];
	for(var i = 0 ; i < arrangement_arr.length; i++){
		var extension = path.extname(arrangement_arr[i]);
		var file 	  = path.basename(arrangement_arr[i],extension);
		temp_arr.push({filename: arrangement_arr[i], file_basename: file});
	}
	
	res.send({status_code: 0, data: temp_arr});
});

router.post('/summary/insert', function(req, res) {
	log.insert_summary_report(req, res).then(function(info){
		res.send({status_code: 0, data: info});
		
	}, function(err){
		res.send({status_code: err.status_code, message: err.message});
	});
	
});

module.exports = router;