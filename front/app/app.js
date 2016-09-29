'use strict';

var myApp = angular.module('myApp', [
	'ngRoute',
	'myApp.services',
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
		controller: 'StockCtrl',
		resolve: {
			Items: function(loadData) {
				return loadData.getItems();
			}
		}
	});
	$routeProvider.when('/sales', {
		templateUrl: 'app/views/sales/sales.html', 
		controller: 'SalesCtrl',
		resolve: {
			Sales: function(loadData) {
				return loadData.getSales();
			}
		}
	});
	$routeProvider.when('/sales/create', {
		templateUrl: 'app/views/sales/sale_detail.html', 
		controller: 'SaleDetailCtrl',
		resolve: {
			Items: function(loadData) {
				return loadData.getItems();
			},
			Sales: function(loadData) {
				return loadData.getSales();
			}
		}
	});
	$routeProvider.when('/sales/edit/:number', {
		templateUrl: 'app/views/sales/sale_detail.html', 
		controller: 'SaleDetailCtrl',
		resolve: {
			Items: function(loadData) {
				return loadData.getItems();
			},
			Sales: function(loadData) {
				return loadData.getSales();
			}
		}
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
	$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
	    if (curr.$$route && curr.$$route.resolve) {
			// Show a loading message until promises aren't resolved
			$rootScope.loadingView = true;
		}
	});
	$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
		// Hide loading message
		$rootScope.loadingView = false;
	});
});
