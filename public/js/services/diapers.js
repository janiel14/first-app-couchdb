angular.module('first-app-couchdb').factory('Diapers', function($resource) {
    var _self = {};

    /**
     * save
     * @return {Object} resource
     */
    _self.save = function() {
        return $resource('/api/diapers');
    }

    /**
     * getAll
     * @return {Object} resource
     */
    _self.getAll = function() {
        return $resource('/api/diapers');
    }

    /**
     * get
     * @return {Object} resource
     */
    _self.get = function() {
        return $resource('/api/diapers/:model');
    }

    /**
     * delete
     * @return {Object} resource
     */
    _self.delete = function() {
        return $resource('/api/diapers/:model/:rev');
    }

    return _self;
});