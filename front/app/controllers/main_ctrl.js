'use strict';

angular.module('myApp.main_ctrl', [])
.constant('PATH_STOCK','app/views/stock/')
.constant('PATH_SALES','app/views/sales/')

.controller('MainCtrl', function($rootScope, $scope, $http, $uibModal, PATH_STOCK){

    // Fetch API
    $rootScope.fetchItems = function() {
        $http.get('/stock/read').then(function(res) {
            $rootScope.stock = res.data;
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };
    $rootScope.fetchSales = function(callback) {
        $http.get('/sales/read').then(function(res) {
            $rootScope.sales = res.data;
            $rootScope.$broadcast('updateStates',$rootScope.sales);
            if (typeof callback !== 'undefined') callback();
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
    $rootScope.createSale = function(sale) {
        $http.post('/sales/create',sale).then(function(res) {
            $rootScope.sales.push(res.data.sale);
            $rootScope.$broadcast('updateStatuses',$rootScope.sales);
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