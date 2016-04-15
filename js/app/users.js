var app = angular.module('app');

app.controller('Users', function($rootScope, $scope, $timeout) {
	
	$scope.users = [];
	$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
	
	$scope.resetForm = function() {
		$scope.newUser = {first_name: '', last_name: '', email: '', isAdmin: 0};
		$scope.newUserForm.$setPristine();
		$scope.newUserForm.$setUntouched();
	};
	
});