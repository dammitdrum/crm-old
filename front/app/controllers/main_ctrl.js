'use strict';

angular.module('myApp.main_ctrl', [])
.constant('PATH_STOCK','app/views/stock/')
.constant('PATH_SALES','app/views/sales/')
.constant('PATH_PARTNERS','app/views/partners/')

.controller('MainCtrl', function($rootScope, $scope, $http, $uibModal, $q, PATH_STOCK){
    
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
            $rootScope.$broadcast('updateStates',$rootScope.sales);
        });
    };
    $rootScope.createPartner = function(partner,hideModal) {
        $http.post('/partners/create',partner).then(function(res) {
            hideModal('cancel');
            $rootScope.partners.push(res.data.partner);
            $rootScope.$broadcast('updateTypes',$rootScope.partners);
        });
    };

    // Save API
    $rootScope.saveItem = function(item,hideModal) {
        $http.put('/stock/update/'+item._id,item).then(function() {
            hideModal('cancel');
            $rootScope.$broadcast('updateCategories',$rootScope.stock);
        });
    };
    $rootScope.saveSale = function(sale) {
        $http.put('/sales/update/'+sale._id,sale).then(function() {
            $rootScope.$broadcast('updateStates',$rootScope.sales);
        });
    };
    $rootScope.savePartner = function(partner,hideModal) {
        $http.put('/partners/update/'+partner._id,partner).then(function() {
            hideModal('cancel');
            $rootScope.$broadcast('updateTypes',$rootScope.partners);
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
    $rootScope.removePartner = function(partner) {
        var id = partner._id;
        $http.delete('/partners/delete/'+id,partner).then(function() {
            angular.forEach($rootScope.stock, function(partner,i) {
                if (id === partner._id) {
                    $rootScope.partners.splice(i,1);
                }
            });
            $rootScope.$broadcast('updateTypes',$rootScope.partners);
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
    $scope.updateFilter = function(data,prop) {
        $scope.filterArr = [''];
        angular.forEach(data, function(el) {
            var find = false;
            for (var i = 0; i < $scope.filterArr.length; i++) {
                if ($scope.filterArr[i] === el[prop]) find = true;
            }
            if (!find) $scope.filterArr.push(el[prop]);
        });
    };
})

.controller('DetailModalCtrl', function($scope, $uibModalInstance, item){
    $scope.item = item;
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})