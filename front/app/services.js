'use strict';

angular.module('myApp.services', [])
.factory('loadData', function ($rootScope, $http) {
    var db = {
        getItems: function() {
            if ($rootScope.stock) return;
            var promise = $http({
                method: 'GET',
                url: '/stock/read'
            });
            promise.success(function(data) {
                return data;
            });
            return promise;
        },
        getSales: function() {
            if ($rootScope.sales) return;
            var promise = $http({
                method: 'GET',
                url: '/sales/read'
            });
            promise.success(function(data) {
                return data;
            });
            return promise;
        },
        getPartners: function() {
            if ($rootScope.partners) return;
            var promise = $http({
                method: 'GET',
                url: '/partners/read'
            });
            promise.success(function(data) {
                return data;
            });
            return promise;
        }
    }
    return db;
})
.factory('stockCore',function ($rootScope) {
    return function (data,type,state) {
        if (state === 'remove') return;

        angular.forEach(data,function(j) {
            angular.forEach($rootScope.stock,function(i) {
                if (j._id === i._id) {
                    console.log(i);
                    worker(i,j,type,state);
                    $rootScope.saveItem(i);
                }
            })
        })
        function worker(i,j,type,state) {
            var q = j.number;
            switch(state) {
                case 'approved':
                    if (type === 'sale') {
                        i.debt += q;
                    }
                    if (type === 'order') {
                        i.ordered += q;
                    }
                    break;
                case 'closed':
                    if (type === 'sale') {
                        i.quantity -= q;
                        i.debt -= q;
                    }
                    if (type === 'order') {
                        i.quantity += q;
                        i.ordered -= q;
                    }
                    break;
                case 'canceled':
                    if (type === 'sale') {
                        i.debt -= q;
                    }
                    if (type === 'order') {
                        i.ordered -= q;
                    }
                    break;
            }
        };
    };
})