var app = angular.module('app');

app.factory('AuthService', function($http) {
	
	return {
		
		login: function(user) {
			return $http.post('../inventory-api/auth_user.php', user)
				.then(function(res) {
					return res.data;
				})
		}
		
	}
	
});

app.controller('Login', function($rootScope, $scope, $timeout, AuthService, localStorageService) {

	$scope.login = function(user) {
		AuthService.login(user)
			.then(function(res) {
				console.log(res.result);
				if (res.result == "success") {
					$rootScope.user.username = res.message.username;
					$rootScope.user.password = "";
					$rootScope.user.first_name = res.message.first_name;
					$rootScope.user.last_name = res.message.last_name;
					$rootScope.user.is_admin = res.message.is_admin;
					$rootScope.user.logged = true;
					localStorageService.set("user", $rootScope.user);
					console.log(localStorageService.get("user"));
				} else {
					$rootScope.user = {};
					$rootScope.user.authMsg = res.message;
				}
			});
	};
	
});