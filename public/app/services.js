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
    return function (data,type,oldState,state) {
        angular.forEach(data,function(j) {
            angular.forEach($rootScope.stock,function(i) {
                if (j.id === i._id) {
                    if (worker(i,j,type,oldState,state)) $rootScope.saveItem(i);
                }
            })
        })
        function worker(i,j,type,oldState,state) {
            var q = +j.number;
            if (type === 'sale') {
                switch(state) {
                    case 'new':
                        if (oldState === 'approved') {
                            i.debt -= q;
                            return true;
                        }
                        break;
                    case 'approved':
                        if (oldState === 'new') {
                            i.debt += q;
                            return true;
                        }
                        break;
                    case 'closed':
                        if (oldState === 'new') {
                            i.quantity -= q;
                            return true;
                        }
                        if (oldState === 'approved') {
                            i.debt -= q;
                            i.quantity -= q;
                            return true;
                        }
                        break;
                    case 'canceled':
                        if (oldState === 'approved') {
                            i.debt -= q;
                            return true;
                        }
                        break;
                    default: 
                        return false;
                }
            }
            if (type === 'order') {
                switch(state) {
                    case 'new':
                        if (oldState === 'approved') {
                            i.ordered -= q;
                            return true;
                        }
                        break;
                    case 'approved':
                        if (oldState === 'new') {
                            i.ordered += q;
                            return true;
                        }
                        break;
                    case 'closed':
                        if (oldState === 'new') {
                            i.quantity += q;
                            return true;
                        }
                        if (oldState === 'approved') {
                            i.ordered -= q;
                            i.quantity += q;
                            return true;
                        }
                        break;
                    case 'canceled':
                        if (oldState === 'approved') {
                            i.ordered -= q;
                            return true;
                        }
                        break;
                    default: 
                        return false;
                }
            }
        };
    };
})