'use strict';

var myApp = angular.module('myApp', [
	'ngRoute',
    'myApp.main_ctrl',
    'myApp.head_ctrl',
    'myApp.stock_ctrl',
    'myApp.sales_ctrl',
    'myApp.orders_ctrl',
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
	$routeProvider.when('/sales', {
		templateUrl: 'app/views/sales/sales.html', 
		controller: 'SalesCtrl'
	});
	$routeProvider.when('/sales/create', {
		templateUrl: 'app/views/sales/sale_detail.html', 
		controller: 'SaleDetailCtrl'
	});
	$routeProvider.when('/sales/edit/:number', {
		templateUrl: 'app/views/sales/sale_detail.html', 
		controller: 'SaleDetailCtrl'
	});
	$routeProvider.when('/orders', {
		templateUrl: 'app/views/orders/orders.html', 
		controller: 'OrdersCtrl'
	});
    $routeProvider.otherwise({
    	redirectTo: '/stock'
    });
});

myApp.run(function($rootScope) {
	
});
