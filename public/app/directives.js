'use strict';

angular.module('myApp.directives', [])

.directive('example', function() {
    return {
		restrict: 'E',
		//templateUrl: 'example.html',
		link: function(scope, element, attr) {
		 	
		}
	};
});