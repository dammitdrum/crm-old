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

	var routes = [
		{
			url: "/stock",
			config: {
				templateUrl: "app/views/stock/stock.html",
				controller: "StockCtrl"
			}
		},
		{
			url: "/sales",
			config: {
				templateUrl: "app/views/sales/sales.html",
				controller: "SalesCtrl"
			}
		},
		{
			url: "/sales/create",
			config: {
				templateUrl: "app/views/sales/sale_detail.html",
				controller: "SaleDetailCtrl"
			}
		},
		{
			url: "/sales/edit/:number",
			config: {
				templateUrl: "app/views/sales/sale_detail.html",
				controller: "SaleDetailCtrl"
			}
		},
		{
			url: "/orders",
			config: {
				templateUrl: "app/views/orders/orders.html",
				controller: "OrdersCtrl"
			}
		},
		{
			url: "/orders/create",
			config: {
				templateUrl: "app/views/orders/order_detail.html",
				controller: "OrderDetailCtrl"
			}
		},
		{
			url: "/orders/edit/:number",
			config: {
				templateUrl: "app/views/orders/order_detail.html",
				controller: "OrderDetailCtrl"
			}
		},
		{
			url: "/partners",
			config: {
				templateUrl: "app/views/partners/partners.html",
				controller: "PartnersCtrl"
			}
		},
		{
			url: "/user",
			config: {
				templateUrl: "app/views/user/user.html",
				controller: "UserCtrl"
			}
		},
	];
	angular.forEach(routes, function (route) {
		var url = route.url;
		var routeConfig = route.config;

		routeConfig.resolve = angular.extend(routeConfig.resolve || {}, {
			Items: function(loadData) {
				return loadData.getItems();
			},
			Sales: function(loadData) {
				return loadData.getSales();
			},
			Orders: function(loadData) {
				return loadData.getOrders();
			},
			Partners: function(loadData) {
				return loadData.getPartners();
			}
		});
		$routeProvider.when(url, routeConfig);
	});
    $routeProvider.otherwise({
    	redirectTo: '/stock'
    });
});

myApp.run(function ($rootScope,checkAuth) {
	$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
		if (!$rootScope.auth) {
			e.preventDefault();
			checkAuth();
		}
	    if (curr.$$route && curr.$$route.resolve) {
			$rootScope.loadingView = true;
		}
	});
	$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
		$rootScope.loadingView = false;
	});
});
