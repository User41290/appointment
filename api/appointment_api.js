var model 		= require("../models");
var sequelize 	= model.sequelize;
var joi 		= require('joi');
var _joi 		= require('../joi_validate')();
var _ 			= require('underscore');

const db_err = {status_code: 1000, message: "DB operation is failed."};

exports.get 	= get_appointment;
exports.create 	= create_appointment;

function get_appointment(req, res){
	
	//res.send({status_code: 0, message: "", data: ["2021-11-29", "2021-11-30", "2021-12-1"]});

	var player_id = req.params.designer_id;

	/* sequelize.query("select a.category, a.code, a.description, a.of_the_day, (CASE WHEN p.id is not null THEN p.id ELSE 0 END) AS id, (CASE WHEN p.level is not null THEN p.level ELSE 0 END) AS level, (CASE WHEN p.value is not null THEN p.value ELSE 0 END) AS curr_value from achievement_category as a left join player_achievement as p on a.id = p.achv_category_id and player_id = "+player_id, {type: sequelize.QueryTypes.SELECT}).then(function(achv){
		if(achv.length > 0){
			var achv_arr = calc_divider(achv);
			var statistic_arr = [];
			for(var i = 0 ; i < achv_arr.length; i++){
				if(achv_arr[i].of_the_day == 1){
					statistic_arr.push(achv_arr[i]);
				}
			}
			
			res.send({status_code: 0, message: "", data: {statistic: statistic_arr, achievement: achv_arr}});
		}else{
			res.send({status_code: 2010, message: "Your request was made with invalid credentials."});
		}
	}).catch(function(err){
		console.log(err);
		res.send(db_err);
	}); */

}


function create_appointment(req, res){
	var result = joi.validate(req.body, _joi.joiAppointmentCreate());
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
