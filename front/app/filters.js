'use strict';

angular.module('myApp.filters', [])

.filter('example', function() {
    return function(query) {
        return query;
    };
});