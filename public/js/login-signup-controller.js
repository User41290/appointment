angular.module("app")
	.controller("LoginController", function ($scope, $rootScope, $window, $state, api) {
		$scope.verify_user = function() {
			return new Promise(function(success, reject){
				api.verify_user($scope.username, $scope.password)
				.then(function (resp) {
					if (!resp) {
						console.log("error");
						reject();
					} else {
						success(resp);
					}
				});
			});
		}
		
		
		$scope.signup_button = function() {
			$state.go('signup');
		}
		
		$scope.formSubmit = async function() {
			// check if superadmin and correct username & password
			var resp = await $scope.verify_user($scope.username, $scope.password);
			if(resp.status_code > 0){
				$scope.$applyAsync(function(){
					$scope.error = resp.message;
				});
			}
			else{
				$rootScope.userName = $scope.username;
				$rootScope.user_id = resp.data.user_id;
				$rootScope.role 	= "admin";
				$scope.error = '';
				$scope.username = '';
				$scope.password = '';
				$state.transitionTo('admin');
				$rootScope.is_verified = true;
			}
			
		};
		
	})
	.controller("SignUpController", function ($scope, $rootScope, $window, $state, api, $timeout, $mdDialog) {
		$('#signup_confirmation').modal('show');
		
		$scope.sign_up = function() {
			return new Promise(function(success, reject){
				api.sign_up($scope.username, $scope.password, $scope.display_name, $scope.email)
				.then(function (resp) {
					if (!resp) {
						console.log("error");
						reject();
					} else {
						success(resp);
					}
				});
			});
		}
		
		$scope.formSubmit = async function() {
			try {
				$scope.error = "";
				if($scope.password != $scope.confirm_password){
					throw 'Confirm password must same as password.';
				//	$scope.error = 'Confirm password must same as password.';
				}
				else if($scope.password.length < 6){
					throw 'Password must has at least 6 characters.';
				}
				
				var resp = await $scope.sign_up($scope.username, $scope.password, $scope.display_name, $scope.email);
				
				if(resp.status_code > 0){
					alertify.error(resp.message);
				}
				else{
					$mdDialog
					.show(
					  $mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Sign Up')
						.textContent('Your account has been setup successfully.')
						.ariaLabel('Alert Dialog Demo')
						.ok('Go to Login Page')
					)
					.then(
						function(successData) {
							$state.go("login");
						}, function(cancelData) {
						// This will be call because of $mdDialog.cancel
						
						}
					);
				}
				
			} catch (err) {
				 $timeout(function() {
					 $scope.error = err;
				 });
			}
		};
		
		$scope.back_to_login = function() {
			$state.go("login");
		}
		
		
	});
	