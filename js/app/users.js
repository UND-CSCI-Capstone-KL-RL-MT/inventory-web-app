var app = angular.module('app');

app.controller('Users', function($rootScope, $scope, $timeout) {
	
	$scope.users = [];
	$scope.newUser = {first_name: '', last_name: '', email: ''};
	
	$scope.resetForm = function() {
		$scope.newUser = {first_name: '', last_name: '', email: ''};
		$scope.newUserForm.$setPristine();
		$scope.newUserForm.$setUntouched();
	};
	
});