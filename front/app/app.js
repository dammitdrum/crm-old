'use strict';

var myApp = angular.module('myApp', [
	'ngRoute',
    'myApp.controllers',
    'myApp.directives',
    'myApp.filters',
    'ngAnimate',
    'ui.bootstrap'
]);

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/stock', {
		templateUrl: 'templates/stock.html', 
		controller: 'StockCtrl'
	});
	$routeProvider.when('/orders', {
		templateUrl: 'templates/orders.html', 
		controller: 'OrdersCtrl'
	});
	$routeProvider.when('/ships', {
		templateUrl: 'templates/ships.html', 
		controller: 'ShipsCtrl'
	});
    $routeProvider.otherwise({
    	redirectTo: '/stock'
    });
}]);

myApp.run(['$rootScope', function($rootScope) {
	
}]);
