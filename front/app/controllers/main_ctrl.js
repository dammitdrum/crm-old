'use strict';

angular.module('myApp.main_ctrl', [])
.constant('PATH_STOCK','app/views/stock/')
.constant('PATH_ORDERS','app/views/orders/')

.controller('MainCtrl', function($rootScope, $scope, $http, $uibModal, PATH_STOCK){

    // Fetch API
    $rootScope.fetchItems = function() {
        $http.get('/stock/read').then(function(res) {
            $rootScope.stock = res.data;
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };
    $rootScope.fetchOrders = function() {
        $http.get('/orders/read').then(function(res) {
            $rootScope.orders = res.data;
            $rootScope.$broadcast('updateStates',$rootScope.orders);
        });
    };

    // Create API
    $rootScope.createItem = function(item,hideModal) {
        $http.post('/stock/create',item).then(function(res) {
            hideModal('cancel');
            $rootScope.stock.push(res.data.item);
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };
    $rootScope.createOrder = function(order) {
        $http.post('/orders/create',order).then(function(res) {
            $rootScope.orders.push(res.data.order);
            $rootScope.$broadcast('updateStatuses',$rootScope.orders);
        });
    };

    // Save API
    $rootScope.saveItem = function(item,hideModal) {
        $http.put('/stock/update/'+item._id,item).then(function() {
            hideModal('cancel');
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };

    // Delete API
    $rootScope.removeItem = function(item) {
        var id = item._id;
        $http.delete('/stock/delete/'+id,item).then(function() {
            angular.forEach($rootScope.stock, function(item,i) {
                if (id === item._id) {
                    $rootScope.stock.splice(i,1);
                }
            });
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };

    // common methods
    $scope.openDetailItemModal = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_STOCK+'detail_modal.html',
            controller: 'DetailModalCtrl',
            size: 'lg',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    };
})

.controller('DetailModalCtrl', function($scope, $uibModalInstance, item){
    $scope.item = item;
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})