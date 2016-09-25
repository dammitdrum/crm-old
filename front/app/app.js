'use strict';

var myApp = angular.module('myApp', [
	'ngRoute',
    'myApp.main_ctrl',
    'myApp.head_ctrl',
    'myApp.stock_ctrl',
    'myApp.orders_ctrl',
    'myApp.ships_ctrl',
    'myApp.directives',
    'myApp.filters',
    'ngAnimate',
    'ui.bootstrap'
]);

myApp.config(function($routeProvider) {

	$routeProvider.when('/stock', {
		templateUrl: 'app/views/stock/stock.html', 
		controller: 'StockCtrl'
	});
	$routeProvider.when('/orders', {
		templateUrl: 'app/views/orders/orders.html', 
		controller: 'OrdersCtrl'
	});
	$routeProvider.when('/orders/create', {
		templateUrl: 'app/views/orders/order_detail.html', 
		controller: 'OrderDetailCtrl'
	});
	$routeProvider.when('/ships', {
		templateUrl: 'app/views/ships/ships.html', 
		controller: 'ShipsCtrl'
	});
    $routeProvider.otherwise({
    	redirectTo: '/stock'
    });
});

myApp.run(function($rootScope) {
	
});
