var app = angular.module('app', ['ngMaterial', 'ngRoute']);

app.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('indigo')
		.accentPalette('pink')
});

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'Home',
			templateUrl: '../templates/home.html'
		})
		.otherwise({ redirectTo: '/' });
})