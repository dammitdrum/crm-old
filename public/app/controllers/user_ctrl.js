'use strict';

angular.module('myApp.user_ctrl', [])

.controller('LoginCtrl', function ($rootScope, $scope, $http, $location, PATH_USER){

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
                $rootScope.User = res.data.user;
                $location.path('/stock');
            }
        });
    };

})

.controller('UserCtrl', function ($rootScope, $scope, $http, $location, $uibModal, PATH_USER) {
    
	$scope.logout = function() {
		 $http.post('/logout').then(function(res) {
		 	$rootScope.auth = false;
            $rootScope.User = {};
		 })
	};
    $scope.deleteUser = function(user) {
        $rootScope.removeUser(user);
    };
    $scope.openUserModal = function(mode,user) {
        if (mode==='create') {
            user = {};
        }
        var modalInstance = $uibModal.open({
            templateUrl: PATH_USER+'user_modal.html',
            controller: 'UserModalCtrl',
            resolve: {
                user: function() {
                    return user;
                },
                mode: function() {
                    return mode;
                }
            }
        });
    };
})

.controller('UserModalCtrl',function ($rootScope, $scope, $uibModalInstance, user, mode){
    $scope.mode = mode;
    $scope.newUser = angular.copy(user);
    $scope.mode === 'create' ? $scope.newUser.access = 'manager' : '';
    $scope.create = function(newUser) {
        $rootScope.createUser(newUser,$uibModalInstance.dismiss);
    };
    $scope.save = function(newUser) {
        for (var key in newUser) {
            user[key] = newUser[key];
        }
        $rootScope.saveUser(user,$uibModalInstance.dismiss);
    };
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})