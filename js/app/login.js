var app = angular.module('app');

/**
 * The AuthService utilizes the $http service to
 * make calls to log the user in to the application
 */
app.factory('AuthService', function($http) {
	
	return {
		
		/**
		 * login attempts to log in the specified user
		 * @arg user The user to be logged in
		 */
		login: function(user) {
			return $http.post('../inventory-api/auth_user.php', user)
				.then(function(res) {
					return res.data;
				})
		}
		
	}
	
});

/**
 * The Login controller controls the login screen, using the rootScope to store the user's data
 * and the localStorage service to store the user's data in the browser's local storage
 */
app.controller('Login', function($rootScope, $scope, $timeout, AuthService, localStorageService) {

	/**
	 * The login function attempts to log in the specified user
	 * through a call to the AuthService
	 * @arg user The user to be logged in
	 */
	$scope.login = function(user) {
		AuthService.login(user)
			.then(function(res) {
				console.log(res.result);
				
				// if the login was successful, set the rootScope user
				if (res.result == "success") {
					$rootScope.user.username = res.message.username;
					$rootScope.user.password = "";
					$rootScope.user.first_name = res.message.first_name;
					$rootScope.user.last_name = res.message.last_name;
					$rootScope.user.is_admin = res.message.is_admin;
					$rootScope.user.user_id = res.message.user_id;
					$rootScope.user.logged = true;
					localStorageService.set("user", $rootScope.user);
					console.log(localStorageService.get("user"));
					
				// else clear the rootScope user and display the error message
				} else {
					$rootScope.user = {};
					$rootScope.user.authMsg = res.message;
				}
			});
	};
	
	$scope.showForgotPasswordDialog = function() {
		
	};
	
});