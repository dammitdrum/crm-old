'use strict';

angular.module('myApp.services', [])
.factory('checkAuth',function ($rootScope,$http,$location,$route) {
    return function() {
        if ($location.path()) $rootScope.startRoute = $location.path();
        $rootScope.loadingAuthView = true;
        $http.post('/auth').then(function(res) {
            if (res.data === 'noAuth') {
                $rootScope.User = {};
                $rootScope.loadingView = false;
            } else {
                $rootScope.auth = true;
                $rootScope.User = res.data.user;
                $location.path($rootScope.startRoute);
                $route.reload();
            }
            $rootScope.loadingAuthView = false;
        });
    };
})
.factory('loadData',function ($rootScope,$http,$location,$route) {
    return function() {
        if ($location.path()) $rootScope.startRoute = $location.path();
        $rootScope.loadingView = true;
        $http({
            method: 'GET',
            url: '/stock/read'
        }).then(function(data) {
            $rootScope.stock = data.data;
            $http({
                method: 'GET',
                url: '/sales/read'
            }).then(function(data) {
                $rootScope.sales = data.data;
                $http({
                    method: 'GET',
                    url: '/orders/read'
                }).then(function(data) {
                    $rootScope.orders = data.data;
                    $http({
                        method: 'GET',
                        url: '/partners/read'
                    }).then(function(data) {
                        $rootScope.partners = data.data;
                        $http({
                            method: 'GET',
                            url: '/users/read'
                        }).then(function(data) {
                            $rootScope.users = data.data;
                            $rootScope.loadingView = false;
                            $rootScope.dataLoaded = true;
                            $location.path($rootScope.startRoute);
                            $route.reload();
                        })
                    })
                })
            })
        });
    };
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
                }
            }
        };
    };
})