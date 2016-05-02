var app = angular.module('app', 
						 [
							'ngMaterial', 
							'ngRoute', 
							'ngMessages',
							'ui.grid',
							'ui.grid.edit',
							'ui.select',
							'ui.grid.cellNav',
							'ui.grid.exporter',
							'ui.grid.importer',
							'ui.grid.resizeColumns',
							'LocalStorageModule'
						 ]);

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
			templateUrl: './templates/home.html',
			permissions: 'user'
		})
		.when('/users', {
			controller: 'Users',
			templateUrl: './templates/users.html',
			permissions: 'admin'
		})
		.when('/inventory', {
			controller: 'Inventory',
			templateUrl: './templates/inventory.html',
			permissions: 'user'
		})
		.when('/profile', {
			controller: 'Account',
			templateUrl: './templates/account.html',
			permissions: 'user'
		})
		.otherwise({ redirectTo: '/' });
});

app.directive('noAnimate', function ($animate) {
	return function(scope, element) {
		$animate.enabled(false, element);
	};
});

app.directive('localView', function(localStorageService, $rootScope) {
	return function(scope, element) {
		if (localStorageService.get("user") != null) {
			console.log(localStorageService.get("user"));
			console.log(scope.$root.user);
			scope.$root.user = localStorageService.get("user");
			console.log(scope.$root.user);
		}
	};
});