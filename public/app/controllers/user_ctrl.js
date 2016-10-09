'use strict';

angular.module('myApp.user_ctrl', [])

.controller('LoginCtrl', function ($rootScope, $scope, $http){

	$scope.enterUser = function(user) {
        $http.post('/user/create',user).then(function(res) {
        	console.log(res.data);
            //$location.path('/stock');
        });
    };

})
