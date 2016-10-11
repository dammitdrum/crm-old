'use strict';

angular.module('myApp.main_ctrl', [])
.constant('PATH_STOCK','app/views/stock/')
.constant('PATH_PARTNERS','app/views/partners/')

.controller('MainCtrl', function ($rootScope, $scope, $http, $uibModal, $location, PATH_STOCK, PATH_PARTNERS){
    
    // Create API
    $rootScope.createItem = function(item,modal) {
        createWorker(item,'/stock/create',$rootScope.stock,'updateCategories',modal);
    };
    $rootScope.createSale = function(sale) {
        createWorker(sale,'/sales/create',$rootScope.sales,'updateStates');
    };
    $rootScope.createOrder = function(order) {
        createWorker(order,'/orders/create',$rootScope.orders,'updateStates');
    };
    $rootScope.createPartner = function(partner,modal) {
        createWorker(partner,'/partners/create',$rootScope.partners,'updateTypes',modal);
    };
    function createWorker(item,url,data,str,modal) {
        $http.post(url,item).then(function(res) {
            if (modal) modal('cancel');
            data.push(res.data.item);
            $rootScope.$broadcast(str,data);
        });
    };

    // Save API
    $rootScope.saveItem = function(item,modal) {
        saveWorker(item,'/stock/update/',$rootScope.stock,'updateCategories',modal);
    };
    $rootScope.saveSale = function(sale) {
        saveWorker(sale,'/sales/update/',$rootScope.sales,'updateStates');
    };
    $rootScope.saveOrder = function(order) {
        saveWorker(order,'/orders/update/',$rootScope.orders,'updateStates');
    };
    $rootScope.savePartner = function(partner,modal) {
        saveWorker(partner,'/partners/update/',$rootScope.partners,'updateTypes',modal);
    };

    function saveWorker(item,url,data,str,modal) {
        $http.put(url+item._id,item).then(function(res) {
            for (var key in res.data.item) {
                item[key] = res.data.item[key];
            }
            if (modal) modal('cancel');
            $rootScope.$broadcast(str,data);
        });
    };

    // Delete API
    $rootScope.removeItem = function(item) {
        deleteWorker(item,'/stock/delete/',$rootScope.stock,'updateCategories');
    };
    $rootScope.removeSale = function(sale) {
        deleteWorker(sale,'/sales/delete/',$rootScope.sales,'updateState','/sales');
    };
    $rootScope.removeOrder = function(order) {
        deleteWorker(order,'/orders/delete/',$rootScope.orders,'updateState','/orders');
    };
    $rootScope.removePartner = function(partner) {
        deleteWorker(partner,'/partners/delete/',$rootScope.partners,'updateTypes');
    };

    function deleteWorker(item,url,data,str,redirect) {
        var id = item._id;
        $http.delete(url+id,item).then(function() {
            angular.forEach(data, function(item,i) {
                if (id === item._id) {
                    data.splice(i,1);
                }
            });
            if(redirect) $location.path(redirect);
            $rootScope.$broadcast(str,data);
        });
    };

    // common methods
    $scope.openDetailItemModal = function(inItem) {
        var res = {};
        angular.forEach($rootScope.stock, function(item,i) {
            if (inItem._id === item._id) {
                res = item;
            }
        });
        var modalInstance = $uibModal.open({
            templateUrl: PATH_STOCK+'detail_modal.html',
            controller: 'DetailModalCtrl',
            size: 'lg',
            resolve: {
                item: function() {
                    return res;
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
    $scope.openPartnerModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_PARTNERS+'partners_modal.html',
            controller: 'PartnerModalCtrl',
            size: 'lg'
        });
    };
    $scope.openStockModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_STOCK+'stock_modal.html',
            controller: 'StockModalCtrl',
            size: 'lg',
            resolve: {
                stock: function() {
                    return $rootScope.stock;
                }
            }
        });
    };
})