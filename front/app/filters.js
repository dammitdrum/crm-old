'use strict';

angular.module('myApp.filters', [])

.filter('categoryFilter', function() {
    return function(items,query) {
    	var res = [],
    		prop = 'category';

    	if (!query) return items;
    	angular.forEach(items, function(item) {
    		if (item[prop] === query) {
    			res.push(item);
    		}
    	});
        return res;
    };
});