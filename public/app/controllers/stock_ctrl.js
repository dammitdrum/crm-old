'use strict';

angular.module('myApp.stock_ctrl', [])

.controller('StockCtrl', function ($rootScope, $scope, $uibModal, PATH_STOCK, $http){
    console.log('startRender');
    $scope.sortProperty = 'name';
    $scope.currCategory = '';

    if ($rootScope.User.access === 'admin' || $rootScope.User.access === 'stock') {
        $scope.accessToEdit = true;
    }

    $scope.updateFilter($rootScope.stock,'category');

    $scope.$on('updateCategories',function(event,data) {
        $scope.updateFilter(data,'category');
    })
    $scope.$on('rendered',function(event,data) {
        console.log('renderedList');
    })
    
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
        /*var COUNT = 100;
        function createItems() {
            COUNT--;
            var art = Math.floor((Math.random() * 10000) + 1);
            var name = makeName();
            var price = Math.floor((Math.random() * 100000) + 1);
            var item = {
                "art": art,
                "name": name,
                "price": price,
                "category": "Фрукты",
            }
            $http.post('/stock/create',item).then(function(res) {
                $rootScope.stock.push(res.data.item);
                if (COUNT > 0) createItems();
            });
        };
        function makeName() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 6; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
        createItems();*/
    };
})

.controller('PopoverCtrl', function ($rootScope, $scope, PATH_STOCK){
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
})

.controller('EditModalCtrl',function ($rootScope, $scope, $uibModalInstance, item, type){
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
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('DetailModalCtrl', function ($scope, $uibModalInstance, item){
    $scope.item = item;
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('StockModalCtrl', function ($rootScope, $scope, $uibModalInstance, stock){
    $scope.sortProperty = 'name';
    $scope.reverseSort = false;

    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.selectItem = function(item) {
        $rootScope.$broadcast('addItemToList', item);
        $uibModalInstance.dismiss('cancel');
    };
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})