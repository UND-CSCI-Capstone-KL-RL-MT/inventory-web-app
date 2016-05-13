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
app.controller('Login', function($rootScope, $scope, $timeout, $mdDialog, $mdMedia, $mdToast, AuthService, localStorageService) {

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
	
	$scope.showForgotPasswordDialog = function(ev) {
		// use full screen when the extra small breakpoint is reached
		var useFullScreen = $mdMedia('xs');
		
		// Construct and show the material dialog
		$mdDialog.show({
			controller: 'ForgotPasswordDialog',
			templateUrl: './templates/dialogs/forgot_password.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			fullscreen: useFullScreen
		})
			.then(function(result) {
				// If the user saves the new user, display a success message
				if (result == "success") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Your new password was sent to your email address.')
							.position('bottom right')
							.hideDelay(3000)
					);
					$scope.getUsers();
				// If there was a connectivity error, display the error message
				} else if (result == "conn-error") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Could not update your password. Please refresh and try again.')
							.position('bottom right')
							.hideDelay(3000)
					);
				// There was invalid information in the form
				} else {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Your email was not found or was invalid.')
							.position('bottom right')
							.hideDelay(3000)
					);
				}
			}, function() {
			});
	};
	
});

app.controller('ForgotPasswordDialog', function($rootScope, $scope, $timeout, $mdDialog, AuthService, localStorageService) {
	
	/**
	 * The cancel function cancels and closes the dialog
	 */
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
});