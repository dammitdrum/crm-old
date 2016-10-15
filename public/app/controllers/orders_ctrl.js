'use strict';

angular.module('myApp.orders_ctrl', [])

.controller('OrdersCtrl', function ($rootScope, $scope, $location){

    $scope.sortProperty = 'date';
    $scope.reverseSort = false;
    $scope.currState = '';

    $scope.updateFilter($rootScope.orders,'state');

    $scope.$on('updateStates',function(event,data) {
        $scope.updateFilter(data,'state');
    })

    $scope.filterBy = function(name) {
        $scope.currState = name;
    };
    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.editOrder = function(number) {
        $location.path('/orders/edit/'+number);
    };
})

.controller('OrderDetailCtrl', function ($rootScope, $scope, $uibModal, $location, $routeParams, stockCore, PATH_STOCK){

	$scope.order = {};
	$scope.itemsList = [];

    if ($routeParams.number) {
        $scope.editMode = true;
        angular.forEach($rootScope.orders, function(order) {
            if (order.number == $routeParams.number) {
                $scope.order = angular.copy(order);
                $scope.state = $scope.order.state;
                return;
            }
        });
        if ($rootScope.User.access === 'admin' || $rootScope.User.access === 'stock') {
            $scope.accessToEdit = true;
        }
        angular.forEach($scope.order.items, function(orderItem) {
            angular.forEach($rootScope.stock, function(item) {
                if (item._id === orderItem.id) {
                    var clone = angular.copy(item);
                    clone.number = orderItem.number;
                    clone.price = orderItem.price;
                    $scope.itemsList.push(clone);
                    return;
                }
            });
        });
    }

    $scope.$on('addItemToList',function(event,item) {
        var clone = angular.copy(item),
            add = false;

        clone.number = 1;
        angular.forEach($scope.itemsList, function(added) {
            if (clone._id === added._id) {
                added.number++;
                add = true;
                return;
            }
        })
        if (!add) $scope.itemsList.push(clone);
        $scope.$emit('calculate');
    });
    $scope.$on('addPartner',function(event,supplier) {
        $scope.order.supplier = supplier;
    });
    $scope.$on('calculate',function(event) {
        $scope.order.sum = 0;
        $scope.order.items = [];
        angular.forEach($scope.itemsList, function(item) {
            var i = {
                "id": item._id,
                "number": item.number,
                "price": item.price
            };
            $scope.order.items.push(i);
        });
        angular.forEach($scope.itemsList, function(item) {
            $scope.order.sum += item.price*item.number;
        })
    });

    $scope.setState = function(state) {
        $scope.state = state;
    };
    $scope.removeItem = function(item) {
        angular.forEach($scope.itemsList, function(added,i) {
            if (added._id === item._id) $scope.itemsList.splice(i,1);
        });
        $scope.$emit('calculate');
    };
    $scope.refreshPrices = function() {
        angular.forEach($scope.itemsList, function(orderItem) {
            angular.forEach($rootScope.stock, function(item) {
                if (item._id === orderItem._id) {
                    if (orderItem.price !== item.price) {
                        orderItem.price = item.price;
                    }
                    return;
                }
            });
        });
        $scope.$emit('calculate');
    };
    $scope.createOrder = function(order) {
        $rootScope.createOrder(order);
        $location.path('/orders');
    };
    $scope.saveOrder = function(newOrder) {
        var oldOrder = {};
        angular.forEach($rootScope.orders, function(order) {
            if (order.number == $routeParams.number) {
                oldOrder = order;
                return;
            }
        });
        newOrder.state = $scope.state;
        if ( !(oldOrder.state === 'new' && $scope.state === 'new') ) {
            stockCore(newOrder.items,'order',oldOrder.state,newOrder.state);
        }
        for (var key in newOrder) {
            oldOrder[key] = newOrder[key];
        }
        $rootScope.saveOrder(oldOrder);
        $location.path('/orders');
    };
    $scope.removeOrder = function(order) {
        $rootScope.removeOrder(order);
    };
})

