var app = angular.module('app');

app.factory('UsersService', function ($http) {
	
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
		},
		
		updateUser: function(user) {
			return $http.post('../inventory-api/update_user.php', user)
				.then(function(res) {
					return res.data;
				})
		},
		
		removeUser: function(user) {
			return $http.post('../inventory-api/remove_user.php', user)
				.then(function(res) {
					return res.data;
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
	
	$scope.showAddDialog = function(ev) {
		var useFullScreen = $mdMedia('xs');
		$mdDialog.show({
			controller: 'AddUserDialog',
			templateUrl: './templates/dialogs/add_user.html',
			parent: angular.element(document.body),
			targetEvent: ev,
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
	
	$scope.showUpdateDialog = function(user) {
		var useFullScreen = $mdMedia('xs');
		$mdDialog.show({
			controller: 'UpdateUserDialog',
			templateUrl: './templates/dialogs/update_user.html',
			parent: angular.element(document.body),
			/* targetEvent: ev, */
			clickOutsideToClose: true,
			fullscreen: useFullScreen,
			locals: {user: angular.copy(user), caller: $scope}
		})
			.then(function(result) {
				// success
			}, function() {
				// fail
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

app.controller('UpdateUserDialog', function($rootScope, $scope, $mdDialog, $mdMedia, $timeout, UsersService, user, caller) {
	
	$scope.user = user;
	$scope.og_user = angular.copy(user);
	$scope.user.email = $scope.user.username;
	
	$scope.updateUser = function() {
		UsersService.updateUser($scope.user)
			.then(function(res) {
				if (res.result == "success") {
					
				} else {
					$mdDialog.hide('validation-error');
				}
			}, function(res) {
				  $mdDialog.hide('conn-error');
			})
	};
	
	$scope.resetForm = function() {
		$scope.user = $scope.og_user;
		$scope.user.email = $scope.user.username;
		$scope.updateUserForm.$setPristine();
		$scope.updateUserForm.$setUntouched();
	};
	
	$scope.confirmRemove = function(user) {
		var confirm = $mdDialog.confirm()
			.title("Are you sure you'd like to remove " + user.first_name + " " + user.last_name + " from the system?")
			.ariaLabel("Really remove user?")
			.ok('Yes, remove this user')
			.cancel('No');
		
		$mdDialog.show(confirm).then(function() {
			$scope.removeUser(user);
			$mdDialog.hide();
			caller.getUsers();
		}, function() {
		var useFullScreen = $mdMedia('xs');
			$mdDialog.show({
				controller: 'UpdateUserDialog',
				templateUrl: './templates/dialogs/update_user.html',
				parent: angular.element(document.body),
				/* targetEvent: ev, */
				clickOutsideToClose: true,
				fullscreen: useFullScreen,
				locals: {user: angular.copy(user), caller: caller}
			})
				.then(function(result) {
					// success
				}, function() {
					// fail
				});
		})
	}
	
	$scope.removeUser = function() {
		UsersService.removeUser($scope.user)
			.then(function(res) {
				if (res.result == "success") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('User was removed from the system successfully.')
							.position('bottom right')
							.hideDelay(3000)
					);
				} else {
					// fail
				}
			})
	}
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
});