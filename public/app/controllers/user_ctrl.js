'use strict';

angular.module('myApp.user_ctrl', [])

.controller('UserCtrl', function ($rootScope, $scope, $http, $location) {
	$scope.logout = function() {
		 $http.post('/logout').then(function(res) {
		 	$rootScope.auth = false;
		 	$location.path('/');
		 })
	};
})

.controller('LoginCtrl', function ($rootScope, $scope, $http, $location){

	$scope.viewUrl = 'app/views/login.html';
	$scope.err = {};

	$scope.enterUser = function(user) {
        $http.post('/login',user).then(function(res) {
            if (res.data.errType) {
            	$scope.err = {};
            	if (res.data.errType === 'login') {
            		$scope.err.login = true;
            	}
                if (res.data.errType === 'pass') {
            		$scope.err.pass = true;
            	}
            } else {
            	$rootScope.auth = true;
                $scope.err = {};
                $rootScope.user = res.data.user;
                $location.path('/stock');
            }
        });
    };

})
