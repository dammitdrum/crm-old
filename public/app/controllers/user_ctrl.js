'use strict';

angular.module('myApp.user_ctrl', [])

.controller('LoginCtrl', function ($rootScope, $scope, $http, $location){

	$scope.user = {};

	$scope.enterUser = function(user) {
        $http.post('/login',user).then(function(res) {
        	console.log(res.data);
        	$location.path('/stock');
        });
    };

})
