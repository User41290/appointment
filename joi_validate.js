var _ 	= require("underscore");
var joi = require("joi");
var moment = require("moment");

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
		joiAppointmentGet: function(){
			return joi.object().keys({
				designer_id	: joi.number().required(),
			}).options({ stripUnknown: true });
		},
		joiAppointmentUpdate: function(){
			var min_date = moment().add(2, 'days').format('YYYY-MM-DD');
			var max_date = moment().add(3, 'weeks').format('YYYY-MM-DD');
			
			return joi.object().keys({
				appointment_id	: joi.number().required(),
				user_id			: joi.number().positive().required(),
				new_date		: joi.date().greater(min_date).less(max_date).required(),
				new_time_from	: joi.number().positive().min(9).max(18).required(),
				new_time_to		: joi.number().positive().min(9).max(18).required()
			}).options({ stripUnknown: true });
		},
		joiAppointmentCancel: function(){
			return joi.object().keys({
				appointment_id	: joi.number().required(),
			}).options({ stripUnknown: true });
		},
		joiAppointmentCreate: function(){
			var min_date = moment().add(2, 'days').format('YYYY-MM-DD');
			var max_date = moment().add(3, 'weeks').format('YYYY-MM-DD');
			
			return joi.object().keys({
				designer_id	: joi.number().positive().required(),
				user_id		: joi.number().positive().required(),
				date		: joi.date().greater(min_date).less(max_date).required(),
				time_from	: joi.number().positive().min(9).max(18).required(),
				time_to		: joi.number().positive().min(9).max(18).required()
			}).options({ stripUnknown: true });
		},
		joiUserGetAppointment: function(){
			return joi.object().keys({
				user_id	: joi.number().positive().required(),
			}).options({ stripUnknown: true });
		},
		
	}
	return module;
}
