'use strict';

angular.module('myApp.sales_ctrl', [])

.controller('SalesCtrl', function($rootScope, $scope, $location, Sales){
    if (Sales) {
        $rootScope.sales = Sales.data;
    }

    $scope.sortProperty = 'date';
    $scope.reverseSort = false;
    $scope.currState = '';

    $scope.updateStates = function(sales) {
        $scope.statesSales = [''];
        angular.forEach(sales, function(sale) {
            var find = false;
            for (var i = 0; i < $scope.statesSales.length; i++) {
                if ($scope.statesSales[i] === sale.state) find = true;
            }
            if (!find) $scope.statesSales.push(sale.state);
        });
    };
    
    $scope.updateStates($scope.sales);

    $scope.$on('updateStates',function(event,sales) {
        $scope.updateStates(sales);
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

.controller('SaleDetailCtrl', function($rootScope, $scope, $uibModal, $location, $routeParams, Sales, Items,PATH_SALES){
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

    if (Items) {
        $rootScope.stock = Items.data;
    }
    if (Sales) {
        $rootScope.sales = Sales.data;
    }

    $scope.sale = {};
    $scope.itemsList = [];
    $scope.editMode = false;

    if ($routeParams.number) {
        $scope.editMode = true;
        angular.forEach($rootScope.sales, function(sale) {
            if (sale.number == $routeParams.number) {
                $scope.sale = angular.copy(sale);
                return;
            }
        });
        angular.forEach($scope.sale.items, function(saleItem) {
            angular.forEach($rootScope.stock, function(item) {
                if (item._id === saleItem.id) {
                    var clone = angular.copy(item);
                    clone.number = saleItem.number;
                    $scope.itemsList.push(clone);
                    return;
                }
            });
        });
    }

    $scope.$on('addItemToSale',function(event,item) {
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
        $scope.$emit('changeQuant');
    });
    $scope.$on('addCustomerToSale',function(event,customer) {
        $scope.sale.customer = customer;
    });
    $scope.$on('changeQuant',function(event) {
        $scope.sale.sum = 0;
        $scope.sale.items = [];
        angular.forEach($scope.itemsList, function(item) {
            var i = {
                "id": item._id,
                "number": item.number
            };
            $scope.sale.items.push(i);
        });
        angular.forEach($scope.itemsList, function(item) {
            $scope.sale.sum += item.price*item.number;
        })
    });

    $scope.openCustomersModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_SALES+'customer_modal.html',
            controller: 'CustomerModalCtrl',
            size: 'lg'
        });
    };
    $scope.openStockModal = function() {
        if (!$rootScope.stock) $rootScope.fetchItems();

        var modalInstance = $uibModal.open({
            templateUrl: PATH_SALES+'stock_modal.html',
            controller: 'StockModalCtrl',
            size: 'lg',
            resolve: {
                stock: function() {
                    return $rootScope.stock;
                }
            }
        });
    };
    $scope.setState = function(state) {
        $scope.sale.state = state;
    };
    $scope.removeItem = function(item) {
        angular.forEach($scope.itemsList, function(added,i) {
            if (added._id === item._id) $scope.itemsList.splice(i,1);
        });
        $scope.$emit('changeQuant');
    };
    $scope.selectManager = function($event,name) {
        $event.preventDefault();
        $scope.sale.manager = name;
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
        for (var key in newSale) {
            oldSale[key] = newSale[key];
        }
        $rootScope.saveSale(oldSale);
        $location.path('/sales');
    };
})

.controller('StockModalCtrl', function($rootScope, $scope, $uibModalInstance, stock){
    $scope.sortProperty = 'name';
    $scope.reverseSort = false;

    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.addToSale = function(item) {
        $rootScope.$broadcast('addItemToSale', item);
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
        $rootScope.$broadcast('addCustomerToSale', customer);
        $uibModalInstance.dismiss('cancel');
    };
})
