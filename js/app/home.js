var app = angular.module('app');

app.controller('Home', function($rootScope, $scope, $timeout) {
	$rootScope.user = {
		first_name: '',
		last_name: '',
		username: '',
		password: '',
		logged: false,
		first: false
	};
	$scope.theApp = "UND inventory manager";
});