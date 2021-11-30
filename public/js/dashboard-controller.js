angular
	.module("app")
	.controller("AdminLogoutController", function (
		$scope, $rootScope, $window, $state, $stateParams, api, previousPageAndCount
	) {
		console.log("AdminLogoutController");
		previousPageAndCount.reset();
		$state.transitionTo("login");
	})
	.controller("AdminController",
		function ($scope, $rootScope, $window, $state, $stateParams) {
			$scope.username = $stateParams.username;
		}
	)
	.controller("AdminHomeController", [
		"$scope",
		"$rootScope",
		"$timeout",
		"$window",
		"api",
		"$state",
		"$q",
		"$filter",
		"NgTableParams",
		"previousPageAndCount",
		function (
			$scope,
			$rootScope,
			$timeout,
			$window,
			api,
			$state,
			$q,
			$filter,
			NgTableParams,
			previousPageAndCount
		) {
			if ($rootScope.is_verified == false) {
				$state.go("login");
				return;
			}

			api.load_users().then(function (resp) {
				if (!resp) {
					console.log("error");
				} else {
					$scope.users = [];

					var username_arr = Object.keys(resp);
					for (var i = 0; i < username_arr.length; i++) {
						if (
							resp[username_arr[i]].role == "superadmin" ||
							username_arr[i] == $rootScope.userName
						) {
							continue;
						}
						var cannot_display =
							resp[username_arr[i]].role == $rootScope.role ? true : false;
						$scope.users.push({
							username: username_arr[i],
							role: resp[username_arr[i]].role,
							remark: resp[username_arr[i]].remark,
							last_login: $scope.format_time(
								resp[username_arr[i]].last_login_date
							),
							create_date: $scope.format_time(
								resp[username_arr[i]].create_date
							),
							cannot_display: cannot_display,
						});
					}

					//console.log($scope.users);
					//	$scope.tableParams = new NgTableParams({}, { dataset: {data: $scope.users}});

					$scope.tableParams = new NgTableParams({
						page: previousPageAndCount.getPage(),
						sorting: {
							Nome: "asc",
						},
						count: previousPageAndCount.getCount(),
					}, {
						total: $scope.users.length,
						getData: function (params) {
							var data = $scope.users;
							data = params.filter() ?
								$filter("filter")(data, params.filter()) :
								data;
							data = params.orderBy() ?
								$filter("orderBy")(data, params.orderBy()) :
								data;
							params.total(data.length);
							data = data.slice(
								(params.page() - 1) * params.count(),
								params.page() * params.count()
							);
							return data;
						},
					});


				}
			});

			$scope.load_users = function () {
				return new Promise(function (success, reject) {
					api.load_users().then(function (resp) {
						if (!resp) {
							console.log("error");
							reject();
						} else {
							success(resp);
						}
					});
				});
			};

			$scope.save_users = function (json_data, type) {
				return new Promise(function (success, reject) {
					api.save_users(json_data, type).then(function (resp) {
						if (resp.status_code != 0) {
							console.log(resp.message);
							reject(resp.message);
						} else {
							success();
						}
					});
				});
			};

			$scope.delete = function (username) {
				alertify
					.confirm("Confirm to delete user: " + username + "?")
					.setHeader("Delete user")
					.set("onok", async function (closeEvent) {
						var all_users = await $scope.load_users();
						delete all_users[username];

						await $scope.save_users(all_users, "save_users");
						api.insert_action_db(
							$rootScope.userName,
							$rootScope.role,
							"delete user",
							"success",
							"for " + username
						);
						//$state.transitionTo('admin');

						$scope.users = _.without(
							$scope.users,
							_.findWhere($scope.users, {
								username: username,
							})
						);

						var currentCount = $scope.tableParams._params.count;
						var currentPage = $scope.tableParams._params.page;

						if (currentPage > 1) {
							// Page 3 is >20 users
							// Page 2 is >10 users

							var x = currentCount * currentPage - $scope.users.length;

							// x === 10
							if (x === currentCount) {
								$scope.tableParams._params.page--;
							}
						}

						$scope.tableParams.total($scope.users.length);
						$scope.tableParams.reload();
					});
			};

			$scope.format_time = function (date) {
				isitlocal = true;
				if (!date) {
					return "";
				}
				now = new Date(date);
				dd = String(now.getDate()).padStart(2, "0");
				mm = String(now.getMonth() + 1).padStart(2, "0"); //January is 0!
				yyyy = now.getFullYear();

				ofst = now.getTimezoneOffset() / 60;
				secs = now.getSeconds();
				sec = -1.57 + (Math.PI * secs) / 30;
				mins = now.getMinutes();
				min = -1.57 + (Math.PI * mins) / 30;
				hr = isitlocal ?
					now.getHours() :
					now.getHours() + parseInt(ofst) + parseInt(zone);
				hrs = -1.575 +
					(Math.PI * hr) / 6 +
					(Math.PI * parseInt(now.getMinutes())) / 360;

				if (hr < 0) hr += 24;
				if (hr > 23) hr -= 24;

				ampm = hr > 11 ? "PM" : "AM";
				statusampm = ampm.toLowerCase();

				hr2 = hr;
				if (hr2 == 0) hr2 = 12;

				hr2 < 13 ? hr2 : (hr2 %= 12);

				if (hr2 < 10) hr2 = "0" + hr2;

				date2 = yyyy + "-" + mm + "-" + dd;
				savedate = yyyy + mm + dd;
				finaltime =
					date2 +
					" " +
					hr2 +
					":" +
					(mins < 10 ? "0" + mins : mins) +
					":" +
					(secs < 10 ? "0" + secs : secs) +
					" " +
					statusampm;
				return finaltime;
			};

			$scope.setPageAndCount = function () {
				previousPageAndCount.setPage($scope.tableParams._params.page);
				previousPageAndCount.setCount($scope.tableParams._params.count);
			};
		},
	])
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
	});