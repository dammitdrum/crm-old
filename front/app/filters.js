'use strict';

angular.module('myApp.filters', [])

.filter('myFilter', function() {
    return function(items,prop,query) {
    	var res = [];

    	if (!query) return items;
    	angular.forEach(items, function(item) {
    		if (item[prop] === query) {
    			res.push(item);
    		}
    	});
        return res;
    };
});