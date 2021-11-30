//override defaults -> bootstrap
alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";


angular.module('app', ['ui.router','angularUtils.directives.dirPagination','ngTable', 'ngMaterial', 'ngMessages'])
.provider("api", function () {
	this.url = {
		status: '',
	};
	this.$get = ["$http", function ($http) {
		var that = this;
		var defaultResponseReject = function (resp) {
			return resp.data;
		}
		
		var defaultResponseReject2 = function (resp) {
			return JSON.parse(ecrypt.decrypt(resp.data));
		}
		return {
			verify_user: function (username, password) {
				return $http({
					method : 'post',
					url    : "api/user/login",
					data   : {
						username 	: username,
						password	: password
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			load_appointments: function (user_id) {
				return $http({
					method : 'post',
					url    : "api/user/appointment",
					data   : {
						user_id 	: user_id
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			cancel_appointments: function (appt_id, user_id) {
				return $http({
					method : 'post',
					url    : "api/appointment/cancel",
					data   : {
						user_id 		: user_id,
						appointment_id	: appt_id
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			update_appointments: function (appt_id, user_id, new_date, new_time_from, new_time_to) {
				return $http({
					method : 'post',
					url    : "api/appointment/update",
					data   : {
						user_id 		: user_id,
						appointment_id	: appt_id,
						new_date		: new_date,
						new_time_from	: new_time_from,
						new_time_to		: new_time_to
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			create_appointments : function (user_id, designer_id, date, time_from, time_to){
				return $http({
					method : 'post',
					url    : "api/appointment/create",
					data   : {
						user_id 		: user_id,
						designer_id		: designer_id,
						date			: date,
						time_from		: time_from,
						time_to			: time_to
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			get_all_designer: function () {
				return $http({
					method : 'get',
					url    : "api/designer/get"
				})
				.then(defaultResponseReject, defaultResponseReject);
			},
			sign_up: function (username, password, display_name, email) {
				return $http({
					method : 'post',
					url    : "api/user/signup",
					data   : {
						username 	: username,
						password	: password,
						display_name: display_name,
						email		: email
					}
				})
				.then(defaultResponseReject, defaultResponseReject);
			}
		};
	}];
})
.directive('ngFiles', ['$parse', function ($parse) {
	function fn_link(scope, element, attrs) {
		var onChange = $parse(attrs.ngFiles);
		element.on('change', function (event) {
			onChange(scope, { $files: event.target.files });
		});
	};

	return {
		link: fn_link
	}
} ])
.run(function($rootScope, $location, $state, $stateParams) {
    console.clear();
	$rootScope.is_verified = false;
	$state.go('login'); 
})
.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
	//$urlRouterProvider.when("/admin", "/admin/dashboard/users");
	$urlRouterProvider.when("/admin/appointment", "/admin/appointment/list_appointment");
	
    $stateProvider
		.state('login', {
			url : '/login',
			templateUrl : '/public/login.html',
			controller : 'LoginController'
		})
		.state('signup', {
			url : '/signup',
			templateUrl : '/public/signup.html',
			controller : 'SignUpController'
		})
		.state('admin', {
			url : '/admin',
			templateUrl : '/public/admin.html',
			controller: 'AdminController'
		})
		.state("admin.logout", {
			url: "/logout",
			controller: 'AdminLogoutController'
		})
		.state("admin.appointment", {
			url: "/appointment"
		})
		.state("admin.appointment.list", {
			url: "/list",
			templateUrl: '/public/list_appointment.html',
			controller: 'AdminAppointmentController'
		})
		.state("admin.appointment.new", {
			url: "/new",
			templateUrl: '/public/new_appointment.html',
			controller: 'AdminAppointmentController'
		})
		.state("admin.appointment.update", {
			url: "/update/:appt_id",
			templateUrl: '/public/update_appointment.html',
			controller: 'AdminAppointmentController'
		})
		
		
		$urlRouterProvider.otherwise('/login');
  }
])
.controller("AppController", ["$scope", "$rootScope", "$timeout","$window","api", "$state" ,function ($scope, $rootScope, $timeout,$window,api,$state) {
	
	
}])
.controller("AdminAppointmentController", function ($scope, $rootScope, $window, $state, api, $timeout,$stateParams ) {
	$scope.appts_arr 	= [];
	$scope.designer_arr = [];
	
	$scope.load_appointments = function(user_id) {
		return new Promise(function(success, reject){
			api.load_appointments(user_id)
			.then(function (resp) {
				if (!resp) {
					console.log("error");
					reject();
				} else {
					//console.log(resp.data);
					success(resp.data);
				}
			});
		});
	}
	
	$scope.cancel = function(appt_id) {
		return new Promise(function(success, reject){
			api.cancel_appointments(appt_id, $rootScope.user_id)
			.then(function (resp) {
				if (!resp) {
					console.log("error");
					reject();
				} else {
					//console.log(resp.data);
					success(resp.data);
				}
			});
		});
	}
	
	$scope.update = function(appt_id, new_date, new_time_from, new_time_to) {
		return new Promise(function(success, reject){
			api.update_appointments(appt_id, $rootScope.user_id, new_date, new_time_from, new_time_to)
			.then(function (resp) {
				if (!resp) {
					console.log("error");
					reject();
				} else {
					//console.log(resp.data);
					success(resp);
				}
			});
		});
	}
	
	$scope.create = function(desginer_id, date, time_from, time_to) {
		return new Promise(function(success, reject){
			api.create_appointments($rootScope.user_id, desginer_id, date, time_from, time_to)
			.then(function (resp) {
				if (!resp) {
					console.log("error");
					reject();
				} else {
					//console.log(resp.data);
					success(resp);
				}
			});
		});
	}
	
	$scope.init_load = async function(){
		var appts_arr = await $scope.load_appointments($rootScope.user_id);
		$scope.appts_arr = appts_arr;
		console.log($scope.appts_arr);
	}
	
	$scope.cancel_appointment = async function(appt_id){
		try {
			await $scope.cancel(appt_id);
			var appts_arr = await $scope.load_appointments($rootScope.user_id);
			
			$scope.$applyAsync(function(){
				$scope.appts_arr = appts_arr;
			});	
		}
		catch (err) {
			$timeout(function () {
				$scope.error = err;
			}, 0);
		}
	}
	
	$scope.formUpdateApptSubmit = async function(){
		try {
			var resp = await $scope.update($stateParams.appt_id, $scope.new_date, $scope.new_time_from, $scope.new_time_to);
			console.log(resp);
			if(resp.status_code > 0){
				$scope.$applyAsync(function(){
					$scope.error = resp.message;
				});
			}
			else
				$state.go('admin.appointment.list');
			
		}
		catch (err) {
			$timeout(function () {
				$scope.error = err;
			}, 0);
		}
	}
	
	$scope.load_designer = function(){
		return new Promise(function(success, reject){
			api.get_all_designer()
			.then(function (resp) {
				if (!resp) {
					console.log("error");
					reject();
				} else {
					//console.log(resp.data);
					success(resp);
				}
			});
		});
	}
	
	$scope.load_designer_list = async function(){
		var resp 			= await $scope.load_designer();
		console.log(resp.data);
		$scope.$applyAsync(function(){
			$scope.designer_arr = resp.data; 
		});
	}
	
	$scope.formNewApptSubmit = async function(){
		try {
			var resp = await $scope.create($scope.selected.id, $scope.date, $scope.time_from, $scope.time_to);
			console.log(resp);
			if(resp.status_code > 0){
				$scope.$applyAsync(function(){
					$scope.error = resp.message;
				});
			}
			else
				$state.go('admin.appointment.list');
			
		}
		catch (err) {
			$timeout(function () {
				$scope.error = err;
			}, 0);
		}
	}
	
	
	
})
.service("previousPageAndCount", function () {
	/*
		To remember and maintained at the chosen preference after 
		after updating remarks / passwords & deleting users
	*/

	// Default
	var page = 1;
	var count = 10;
	return {
		getPage: function () {
			return page;
		},
		setPage: function (value) {
			page = value;
		},

		getCount: function () {
			return count;
		},
		setCount: function (value) {
			count = value;
		},

		reset: function () {
			page = 1;
			count = 10;
		}
	};
})