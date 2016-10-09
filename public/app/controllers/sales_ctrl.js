'use strict';

angular.module('myApp.sales_ctrl', [])

.controller('SalesCtrl', function ($rootScope, $scope, $location, Sales){
    if (Sales) {
        $rootScope.sales = Sales.data;
    }

    $scope.sortProperty = 'date';
    $scope.reverseSort = false;
    $scope.currState = '';

    $scope.updateFilter($rootScope.sales,'state');

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
    $scope.editSale = function(number) {
        $location.path('/sales/edit/'+number);
    };
})

.controller('SaleDetailCtrl', function ($rootScope, $scope, $uibModal, $location, $routeParams, Sales, Items, Partners, stockCore, PATH_STOCK){
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
    $scope.sale = {};
    $scope.itemsList = [];
    $scope.editMode = false;
    $scope.oldPrices = false;

    if (Items) {
        $rootScope.stock = Items.data;
    }
    if (Sales) {
        $rootScope.sales = Sales.data;
    }
    if (Partners) {
        $rootScope.partners = Partners.data;
    }
    if ($routeParams.number) {
        $scope.editMode = true;
        angular.forEach($rootScope.sales, function(sale) {
            if (sale.number == $routeParams.number) {
                $scope.sale = angular.copy(sale);
                $scope.state = $scope.sale.state;
                return;
            }
        });
        angular.forEach($scope.sale.items, function(saleItem) {
            angular.forEach($rootScope.stock, function(item) {
                if (item._id === saleItem.id) {
                    var clone = angular.copy(item);
                    clone.number = saleItem.number;
                    clone.price = saleItem.price;
                    $scope.itemsList.push(clone);
                    if (saleItem.price !== item.price) $scope.oldPrices = true;
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
    $scope.$on('addPartner',function(event,customer) {
        $scope.sale.customer = customer;
    });
    $scope.$on('calculate',function(event) {
        $scope.sale.sum = 0;
        $scope.sale.items = [];
        angular.forEach($scope.itemsList, function(item) {
            var i = {
                "id": item._id,
                "number": item.number,
                "price": item.price
            };
            $scope.sale.items.push(i);
        });
        angular.forEach($scope.itemsList, function(item) {
            $scope.sale.sum += item.price*item.number;
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
    $scope.selectManager = function($event,name) {
        $event.preventDefault();
        $scope.sale.manager = name;
    };
    $scope.refreshPrices = function() {
        angular.forEach($scope.itemsList, function(saleItem) {
            angular.forEach($rootScope.stock, function(item) {
                if (item._id === saleItem._id) {
                    if (saleItem.price !== item.price) {
                        saleItem.price = item.price;
                    }
                    return;
                }
            });
        });
        $scope.$emit('calculate');
        $scope.oldPrices = false;
    };
    $scope.createSale = function(sale) {
        $rootScope.createSale(sale);
        $location.path('/sales');
    };
    $scope.saveSale = function(newSale) {
        var oldSale = {};
        angular.forEach($rootScope.sales, function(sale) {
            if (sale.number == $routeParams.number) {
                oldSale = sale;
                return;
            }
        });
        if ($scope.state === 'closed') {
            angular.forEach($scope.itemsList,function(item) {
                if (item.quantity < item.number) {
                    $scope.stockCoreError = true;
                    return;
                }
            })
        } else {
            $scope.stockCoreError = false;
        }
        if (!$scope.stockCoreError) {
            newSale.state = $scope.state;
            if ( !(oldSale.state === 'new' && $scope.state === 'new') ) {
                stockCore(newSale.items,'sale',oldSale.state,newSale.state);
            }
            for (var key in newSale) {
                oldSale[key] = newSale[key];
            }
            $rootScope.saveSale(oldSale);
            $location.path('/sales');
        }
    };
    $scope.removeSale = function(sale) {
        $rootScope.removeSale(sale);
    };
})
