angular.module('first-app-couchdb').factory('Sales', function($resource) {
    var _self = {};

    /**
     * save
     * @return {Object} resource
     */
    _self.save = function() {
        return $resource('/api/sales');
    }

    /**
     * getAll
     * @return {Object} resource
     */
    _self.getAll = function() {
        return $resource('/api/sales');
    }

    /**
     * getAll
     * @return {Object} resource
     */
    _self.getTimeToEnd = function() {
        return $resource('/api/sales/timetosoldout/:model/:size');
    }

    return _self;
});