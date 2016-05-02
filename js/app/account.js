var app = angular.module('app');

app.factory('AccountService', function($http) {
	
	return {
		
		updateUser: function(user) {
			return $http.post('../inventory-api/update_user.php', user)
				.then(function(res) {
					return res.data;
				})
		}
		
	}
	
});

app.controller('Account', function($rootScope, $scope, $timeout, $mdToast, AccountService, localStorageService) {
	
	$scope.updatedUser = {};
	$scope.updatedUser.email = $rootScope.user.username;
	$scope.updatedUser.user_id = $rootScope.user.user_id;
	
	$scope.updateUser = function() {
		AccountService.updateUser($scope.updatedUser)
			.then(function(res) {
				$rootScope.user.username = res.message;
				localStorageService.set("user", $rootScope.user);
				$mdToast.show(
						$mdToast.simple()
							.textContent('Account changes saved successfully.')
							.position('bottom right')
							.hideDelay(3000)
					);
					$scope.updatedUser.current_password = "";
					$scope.updatedUser.new_password = "";
					$scope.newUserForm.$setPristine();
					$scope.newUserForm.$setUntouched();
			});
	};
	
});