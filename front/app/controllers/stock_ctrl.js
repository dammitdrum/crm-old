'use strict';

angular.module('myApp.stock_ctrl', [])

.controller('StockCtrl', function($rootScope, $scope, $uibModal, Items, PATH_STOCK){

    if (Items) {
        $rootScope.stock = Items.data;
    }
    $scope.sortProperty = 'name';
    $scope.reverseSort = false;
    $scope.currCategory = '';

    $scope.updateCategories = function(stock) {
        $scope.categoriesItems = [''];
        angular.forEach(stock, function(item) {
            var find = false;
            for (var i = 0; i < $scope.categoriesItems.length; i++) {
                if ($scope.categoriesItems[i] === item.category) find = true;
            }
            if (!find) $scope.categoriesItems.push(item.category);
        });
    };

    $scope.updateCategories($rootScope.stock);
    
    $scope.filterBy = function(name) {
        $scope.currCategory = name;
    };
    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.openEditModal = function(item,type) {
        if (type==='create') {
            item = {};
        }
        var modalInstance = $uibModal.open({
            templateUrl: PATH_STOCK+'edit_modal.html',
            controller: 'EditModalCtrl',
            resolve: {
                item: function() {
                    return item;
                },
                type: function() {
                    return type;
                }
            }
        });
    };
})

.controller('PopoverCtrl', function($rootScope, $scope, PATH_STOCK){
    $scope.popover = {
        templateUrl: PATH_STOCK+'popover_template.html',
        isOpen: false,
        open: function open() {
            $scope.popover.isOpen = $scope.popover.isOpen?false:true;
        },
        close: function close(item) {
            $scope.popover.isOpen = false;
            $scope.openEditModal(item,'edit');
        }
    };
    $scope.deleteItem = function(item) {
        $rootScope.removeItem(item);
    };
    $scope.stopPropagation = function($event) {
        $event.stopPropagation();
    };
})

.controller('EditModalCtrl',function($rootScope, $scope, $uibModalInstance, item, type){
    $scope.newItem = {};
    $scope.type = type;
    $scope.newItem = angular.copy(item);
    $scope.create = function(newItem) {
        $rootScope.createItem(newItem,$uibModalInstance.dismiss);
    };
    $scope.save = function(newItem) {
        for (var key in newItem) {
            item[key] = newItem[key];
        }
        $rootScope.saveItem(item,$uibModalInstance.dismiss);
    };
})