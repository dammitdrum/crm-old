'use strict';

angular.module('myApp.services', [])
.factory('loadData', function($rootScope, $http) {
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
        }
    }
    return db;
});