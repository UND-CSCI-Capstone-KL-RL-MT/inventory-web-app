var app = angular.module('app');

app.factory('UsersService', function($http) {
	
	return {
		
		getUsers: function() {
			return $http.get('../inventory-api/get_users.php')
				.then(function(res) {
					return res.data;
				}, function(res) {
					// failure
				})
		},
		
		addUser: function(user) {
			return $http.post('../inventory-api/add_user.php', user)
				.then(function(res) {
					return res.data;
				}, function(res) {
					// failure
				})
		}
		
	}
	
});

app.controller('Users', function($rootScope, $scope, $mdToast, $mdMedia, $mdDialog, $timeout, UsersService) {
	
	$scope.users = [];
	$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
	
	$scope.getUsers = function() {
		UsersService.getUsers()
			.then(function(res) {
				$scope.users = res;
			}, function() {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Unable to fetch users. Please refresh and try again.')
						.position('bottom right')
						.hideDelay(3000)
				);
			});
	}
	
	$scope.showAddDialog = function() {
		var useFullScreen = $mdMedia('xs');
		$mdDialog.show({
			controller: 'AddUserDialog',
			templateUrl: './templates/dialogs/add_user.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			fullscreen: useFullScreen
		})
			.then(function(result) {
				if (result == "success") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('User was added to the system.')
							.position('bottom right')
							.hideDelay(3000)
					);
					$scope.getUsers();
				} else if (result == "conn-error") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Could not add user to system. Please refresh and try again.')
							.position('bottom right')
							.hideDelay(3000)
					);
				} else {
					$mdToast.show(
						$mdToast.simple()
							.textContent('User could not be added to the system, please check the form and try again.')
							.position('bottom right')
							.hideDelay(3000)
					);
				}
			}, function() {
			});
	};
	
	$scope.getUsers();
	
});

app.controller('AddUserDialog', function($rootScope, $scope, $mdDialog, $timeout, UsersService) {
	
	$scope.addUser = function() {
		UsersService.addUser($scope.newUser)
			.then(function(res) {
				if (res.result == "success") {
					$mdDialog.hide('success');
					$scope.newUser = {first_name: '', last_name: '', email: '', is_admin: 0};
					$scope.newUserForm.$setPristine();
					$scope.newUserForm.$setUntouched();
				} else {
					$mdDialog.hide('validation-error');
				}
			}, function(res) {
				$mdDialog.hide('conn-error');
			});
	};
	
	$scope.resetForm = function() {
		$scope.newUser = {first_name: '', last_name: '', email: '', is_admin: 0};
		$scope.newUserForm.$setPristine();
		$scope.newUserForm.$setUntouched();
	};
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
});