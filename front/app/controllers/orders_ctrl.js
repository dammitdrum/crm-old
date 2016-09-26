'use strict';

angular.module('myApp.orders_ctrl', [])

.controller('OrdersCtrl', function($rootScope, $scope){
	$scope.sortProperty = 'date';
    $scope.reverseSort = false;
	$scope.currState = '';

    $scope.updateStates = function(orders) {
        $scope.statesOrders = [''];
        angular.forEach(orders, function(order) {
            var find = false;
            for (var i = 0; i < $scope.statesOrders.length; i++) {
                if ($scope.statesOrders[i] === order.state) find = true;
            }
            if (!find) $scope.statesOrders.push(order.state);
        });
    };

    if (!$rootScope.orders) {
        $rootScope.fetchOrders();
    } else {
        $scope.updateStates($rootScope.orders);
    }

    $scope.$on('updateStates',function(event,orders) {
        $scope.updateStates(orders);
    })

    $scope.filterBy = function(name) {
        $scope.currState = name;
    };
    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
})

.controller('OrderDetailCtrl', function($rootScope, $scope, $uibModal, PATH_ORDERS){
    $scope.order = {};
    $scope.itemsList = [];
    $scope.managers = [
    	{
    		"name":"Алексей Пучков"
    	},
    	{
    		"name":"Валентина Кольцова"
    	},
    	{
    		"name":"Гриша Матюшкин"
    	}
    ];

    if (!$rootScope.orders) $rootScope.fetchOrders();

    $scope.$on('addItemToOrder',function(event,item) {
    	
    	angular.forEach($scope.itemsList, function(added) {
    		if (item._id === added._id) {
    			added.number++;
    			item = null;
    			return;
    		}
    	})
    	if (item) $scope.itemsList.push(item);
    	angular.forEach($scope.itemsList, function(added) {
    		if (!added.number) added.number = 1;
    	})
    	$scope.itemsAddCheck = $scope.itemsList.length ? true : '';
    });
    $scope.$on('addCustomerToOrder',function(event,customer) {
    	$scope.order.customer = customer;
    });

    $scope.openCustomersModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_ORDERS+'customer_modal.html',
            controller: 'CustomerModalCtrl',
            size: 'lg'
        });
    };
    $scope.openStockModal = function() {
    	if (!$rootScope.stock) $rootScope.fetchItems();

        var modalInstance = $uibModal.open({
            templateUrl: PATH_ORDERS+'stock_modal.html',
            controller: 'StockModalCtrl',
            size: 'lg',
            resolve: {
                stock: function() {
                    return $rootScope.stock;
                }
            }
        });
    };
    $scope.removeItem = function(item) {
    	angular.forEach($scope.itemsList, function(added,i) {
    		if (added._id === item._id) $scope.itemsList.splice(i,1);
    	});
    	$scope.itemsAddCheck = $scope.itemsList.length ? true : '';
    };
    $scope.selectManager = function($event,name) {
    	$event.preventDefault();
    	$scope.order.manager = name;
    };
    $scope.createOrder = function(order) {
    	$scope.order.items = [];
    	angular.forEach($scope.itemsList, function(item) {
    		var i = {
	    		"id": item._id,
	    		"number": item.number
	    	};
	    	$scope.order.items.push(i);
    	});
    	console.log(order);
    	$rootScope.createOrder(order);
    };
})

.controller('StockModalCtrl', function($rootScope, $scope, $uibModalInstance, stock){
	$scope.sortProperty = 'name';
    $scope.reverseSort = false;

    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.addToOrder = function(item) {
    	$rootScope.$broadcast('addItemToOrder', item);
    	$uibModalInstance.dismiss('cancel');
    };
})

.controller('CustomerModalCtrl', function($rootScope, $scope, $uibModalInstance){
   	$scope.customers = [
   		{
   			"number":111,
   			"name":"ООО \"Альбатрос\"",
   			"contact":"albatros@mail.ru, +375 (29) 664-77-84",
   			"person":"Лидия Петровна" 
   		},
   		{
   			"number":112,
   			"name":"ИП \"Паравоз\"",
   			"contact":"+375 (33) 874-11-84",
   			"person":"Тимур Родригез" 
   		},
   		{
   			"number":113,
   			"name":"ОАО \"Газпром\"",
   			"contact":"gasprom@mail.ru, +7 (495) 666-66-66",
   			"person":"Вова Путин" 
   		}
   	];

   	$scope.setCustomer = function(customer) {
   		$rootScope.$broadcast('addCustomerToOrder', customer);
    	$uibModalInstance.dismiss('cancel');
    };
})
