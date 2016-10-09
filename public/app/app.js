'use strict';

var myApp = angular.module('myApp', [
	'ngRoute',
	'ngCookies',
	'myApp.services',
    'myApp.main_ctrl',
    'myApp.head_ctrl',
    'myApp.stock_ctrl',
    'myApp.sales_ctrl',
    'myApp.orders_ctrl',
    'myApp.partners_ctrl',
    'myApp.user_ctrl',
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
			},
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
			},
			Partners: function(loadData) {
				return loadData.getPartners();
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
			},
			Partners: function(loadData) {
				return loadData.getPartners();
			}
		}
	});
	$routeProvider.when('/partners', {
		templateUrl: 'app/views/partners/partners.html', 
		controller: 'PartnersCtrl',
		resolve: {
			Partners: function(loadData) {
				return loadData.getPartners();
			}
		}
	});
	$routeProvider.when('/orders', {
		templateUrl: 'app/views/orders/orders.html', 
		controller: 'OrdersCtrl',
		resolve: {
			Orders: function(loadData) {
				return loadData.getOrders();
			}
		}
	});
	$routeProvider.when('/orders/create', {
		templateUrl: 'app/views/orders/order_detail.html', 
		controller: 'OrderDetailCtrl',
		resolve: {
			Items: function(loadData) {
				return loadData.getItems();
			},
			Orders: function(loadData) {
				return loadData.getOrders();
			},
			Partners: function(loadData) {
				return loadData.getPartners();
			}
		}
	});
	$routeProvider.when('/orders/edit/:number', {
		templateUrl: 'app/views/orders/order_detail.html', 
		controller: 'OrderDetailCtrl',
		resolve: {
			Items: function(loadData) {
				return loadData.getItems();
			},
			Orders: function(loadData) {
				return loadData.getOrders();
			},
			Partners: function(loadData) {
				return loadData.getPartners();
			}
		}
	});
	$routeProvider.when('/user', {
		templateUrl: 'app/views/user/login.html', 
		controller: 'LoginCtrl',
	});
    $routeProvider.otherwise({
    	redirectTo: '/stock'
    });
});

myApp.run(function($rootScope,$location,$http) {
	$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
		if (!$rootScope.auth) {
			e.preventDefault();
			$http.post('/login').then(function(res) {
	        	$rootScope.auth = res.data === 'noAuth' ? false : true;
	        	if ($rootScope.auth) $location.path('/');
	        });
		}
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
