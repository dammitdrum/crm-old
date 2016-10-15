'use strict';

angular.module('myApp.partners_ctrl', [])

.controller('PartnersCtrl', function ($rootScope, $scope, $uibModal, PATH_PARTNERS){
    $scope.sortProperty = 'number';
    $scope.currType = '';

    $scope.updateFilter($rootScope.partners,'type');

    $scope.$on('updateTypes',function(event,data) {
        $scope.updateFilter(data,'type');
    })
    
    $scope.filterBy = function(name) {
        $scope.currType = name;
    };
    $scope.sortBy = function(name) {
        $scope.reverseSort = ($scope.sortProperty === name) ? !$scope.reverseSort : false;
        $scope.sortProperty = name;
    };
    $scope.openDetailModal = function(partner) {
        var modalInstance = $uibModal.open({
            templateUrl: PATH_PARTNERS+'detail_modal.html',
            controller: 'DetailPartnerModalCtrl',
            resolve: {
                partner: function() {
                    return partner;
                }
            }
        });
    };
    $scope.openEditModal = function(partner,mode) {
        if (mode==='create') {
            partner = {};
        }
        var modalInstance = $uibModal.open({
            templateUrl: PATH_PARTNERS+'edit_modal.html',
            controller: 'EditPartnerModalCtrl',
            resolve: {
                partner: function() {
                    return partner;
                },
                mode: function() {
                    return mode;
                }
            }
        });
    };
})

.controller('PopoverPartnerCtrl', function ($rootScope, $scope, PATH_STOCK){
    $scope.popover = {
        templateUrl: PATH_STOCK+'popover_template.html',
        isOpen: false,
        open: function open() {
            $scope.popover.isOpen = $scope.popover.isOpen?false:true;
        },
        close: function close(partner) {
            $scope.popover.isOpen = false;
            $scope.openEditModal(partner,'edit');
        }
    };
    $scope.deleteItem = function(partner) {
        $rootScope.removePartner(partner);
    };
})

.controller('EditPartnerModalCtrl',function ($rootScope, $scope, $uibModalInstance, partner, mode){
    $scope.mode = mode;
    $scope.newPartner = angular.copy(partner);
    $scope.mode === 'create' ? $scope.newPartner.type = 'customer' : '';
    $scope.create = function(newPartner) {
        $rootScope.createPartner(newPartner,$uibModalInstance.dismiss);
    };
    $scope.save = function(newPartner) {
        for (var key in newPartner) {
            partner[key] = newPartner[key];
        }
        $rootScope.savePartner(partner,$uibModalInstance.dismiss);
    };
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('DetailPartnerModalCtrl', function ($scope, $uibModalInstance, partner){
    $scope.partner = partner;
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})

.controller('PartnerModalCtrl', function ($rootScope, $scope, $uibModalInstance){
    $scope.setPartner = function(partner) {
        $rootScope.$broadcast('addPartner', partner);
        $uibModalInstance.dismiss('cancel');
    };
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
})