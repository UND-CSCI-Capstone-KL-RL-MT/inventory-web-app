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

app.controller('Users', function($rootScope, $scope, $mdToast, $timeout, UsersService) {
	
	$scope.users = [];
	$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
	
	$scope.resetForm = function() {
		$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
		$scope.newUserForm.$setPristine();
		$scope.newUserForm.$setUntouched();
	};
	
	$scope.addUser = function() {
		UsersService.addUser($scope.newUser)
			.then(function(res) {
				if (res.result == "success") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('User was added to the system.')
							.position('bottom right')
							.hideDelay(3000)
					);
					$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
					$scope.newUserForm.$setPristine();
					$scope.newUserForm.$setUntouched();
				} else {
					$mdToast.show(
						$mdToast.simple()
							.textContent('User could not be added to the system, please check the form and try again.')
							.position('bottom right')
							.hideDelay(3000)
					);
				}
			}, function(res) {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Could not add user to system. Please refresh and try again.')
						.position('bottom right')
						.hideDelay(3000)
				);
			});
	};
	
});