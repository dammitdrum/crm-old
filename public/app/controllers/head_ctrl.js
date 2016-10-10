'use strict';

angular.module('myApp.head_ctrl', [])

.controller('HeadCtrl', function ($rootScope, $scope, $http, $location){
    $scope.viewUrl = 'app/views/header.html';

    $scope.menu = {};
    
    $http.get('app/menu.json').then(function(res) {
        $scope.menu.items = res.data;
        $scope.setActive();
    });
    $rootScope.$on('$locationChangeSuccess', function () {
        $scope.setActive();
    });
    $scope.setActive = function() {
        $scope.userClass = false;
        angular.forEach($scope.menu.items, function(item) {
            $location.path().indexOf(item.url) !== -1 ? 
                item.className = 'active' : item.className = '';
        })
        if ($location.path() === '/user') {
            $scope.userClass = true;
        }
    };
})