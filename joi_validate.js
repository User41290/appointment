var _ 	= require("underscore");
var joi = require("joi");

module.exports = function(){
	var module = {
		// allow 0
		joiGetAppointment: function (){
			return joi.object().keys({
				date: joi.date().greater('now'),
			}).options({ stripUnknown: true });
		},
		joiUserSignUp: function(){
			return joi.object().keys({
				username	: joi.string().required(),
				password	: joi.string().required(),
				display_name: joi.string().required(),
				email		: joi.string().required().email(),
			}).options({ stripUnknown: true });
		},
		joiUserLogin: function(){
			return joi.object().keys({
				username	: joi.string().required(),
				password	: joi.string().required(),
			}).options({ stripUnknown: true });
		},
		joiAppointmentCreate: function(){
			var min_date = "2021-12-01";
			var max_date = "2021-12-30";
			
			return joi.object().keys({
				designer_id	: joi.number().positive().required(),
				user_id		: joi.number().positive().required(),
				date		: joi.date().greater(min_date).less(max_date).required(),
				
			}).options({ stripUnknown: true });
		},
	}
	return module;
}
