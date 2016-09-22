'use strict';

angular.module('myApp.controllers', [])

.controller('MainCtrl', function($rootScope, $scope, $http){
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
    $scope.fetchItems = function() {
        $http.get('/api/read').then(function(res) {
            $scope.stock = res.data;
            $scope.updateCategories($scope.stock);
        });
    };
    $rootScope.createItem = function(item,hideModal) {
        $http.post('/api/create',item).then(function(res) {
            hideModal('cancel');
            $scope.stock.push(res.data.item);
            $scope.updateCategories($scope.stock);
        });
    };
    $rootScope.saveItem = function(item,hideModal) {
        $http.put('/api/update/'+item._id,item).then(function() {
            hideModal('cancel');
            $scope.fetchItems();
        });
    };
    $rootScope.removeItem = function(item) {
        $http.delete('/api/delete/'+item._id,item).then(function() {
            $scope.fetchItems();
        });
    };
    $scope.fetchItems();
})

.controller('HeadCtrl', function($scope, $http){
    $scope.menu = {};
    $http.get('app/menu.json').then(function(res) {
        $scope.menu.items = res.data;
    });
    $scope.menu.setActive = function(item) {
    	if (item.className !== 'active') {
    		angular.forEach($scope.menu.items, function(item) {
    			item.className = '';
    		})
    		item.className = 'active';
    	}
    };
})

.controller('StockCtrl', function($rootScope, $scope, $uibModal){
    $scope.propertyName = 'name';
    $scope.reverseSort = false;
    $scope.filterParam = '';

    $scope.filterBy = function(name) {
        $scope.filterParam = name;
    };
    $scope.sortBy = function(propertyName) {
        $scope.reverseSort = ($scope.propertyName === propertyName) ? !$scope.reverseSort : false;
        $scope.propertyName = propertyName;
    };
    $scope.openDetailModal = function(item) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/detail_modal.html',
            controller: 'DetailModalCtrl',
            size: 'lg',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    };
    $scope.openEditModal = function(item,type) {
        if (type==='create') {
            item = {};
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/edit_modal.html',
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

.controller('PopoverCtrl', function($rootScope,$scope){
    $scope.popover = {
        templateUrl: 'templates/popover_template.html',
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

.controller('DetailModalCtrl', function($scope, $uibModalInstance, item){
	$scope.item = item;
    $scope.closeModal = function() {
    	$uibModalInstance.dismiss('cancel');
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
        item = angular.copy(newItem);
        $rootScope.saveItem(item,$uibModalInstance.dismiss);
    };
})

.controller('OrdersCtrl', function($rootScope, $scope){
       
})

.controller('ShipsCtrl', function($rootScope, $scope){
       
})