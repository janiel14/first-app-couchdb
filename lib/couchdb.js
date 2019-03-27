const request = require('request');
module.exports = function(app) {
    const _self = {};

    /**
     * createNewDatabase
     * @param {Object} call 
     */
    const createNewDatabase = (call) => {
        try {
            request({
                method: 'PUT',
                url: `${app._couchdb.host}/${app._couchdb.database}`,
                headers: {
                    'Accept': 'application/json'
                },
                auth: {
                    username: app._couchdb.username,
                    password: app._couchdb.password
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error);
                    call(null);
                } else {
                    if (response.statusCode == 201) {
                        call(body);
                    } else {
                        console.error(body);
                        call(null);
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * createDatabaseIfNotExists
     * @return {Object} database
     */
    _self.createDatabaseIfNotExists = (call) => {
        try {
            request({
                method: 'GET',
                url: `${app._couchdb.host}/${app._couchdb.database}`,
                headers: {
                    'Accept': 'application/json'
                },
                auth: {
                    username: app._couchdb.username,
                    password: app._couchdb.password
                }
            }, (error, response, body) => {
                if (error) {
                    console.error(error);
                    call(null);
                } else {
                    if (response.statusCode == 200) {
                        call(JSON.parse(body));
                    } else {
                        createNewDatabase((created) => {
                            if (created) {
                                call(created);
                            } else {
                                call(null);
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error('lin - couchdb - createDatabaseIfNotExists: ', error);
            app.logger.error('lin - couchdb - createDatabaseIfNotExists: ', error);
        }
    }

    /**
     * findAll
     * @param {Object} query
     * @return {Object} response
     */
    _self.findAll = async (query) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'POST',
                    url: `${app._couchdb.host}/${app._couchdb.database}/_all_docs/queries`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    json: true,
                    body: JSON.stringify(query),
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        if (response.statusCode == 200) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lib - couchdb - findAll: ', error);
            throw error;
        }
    }

    /**
     * findAll
     * @return {Object} response
     */
    _self.findAll = async () => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `${app._couchdb.host}/${app._couchdb.database}/_all_docs`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        if (response.statusCode == 200) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lib - couchdb - findAll: ', error);
            throw error;
        }
    }

    /**
     * find
     * @param {String} docid
     * @return {Object} response
     */
    _self.find = async (docid) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `${app._couchdb.host}/${app._couchdb.database}/${docid}?latest=true`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        if (response.statusCode == 200) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lib - couchdb - find: ', error);
            throw error;
        }
    }

    /**
     * createOrUpdate
     * @param {Object} query
     * @param {String} docid
     * @return {Object} response
     */
    _self.createOrUpdate = async (query, docid) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'PUT',
                    url: `${app._couchdb.host}/${app._couchdb.database}/${docid}`,
                    json: true,
                    body: JSON.stringify(query),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        if (response.statusCode == 201) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lib - couchdb - createOrUpdate: ', error);
            throw error;
        }
    }

    /**
     * destroy
     * @param {Object} query
     * @param {String} docid
     * @return {Object} response
     */
    _self.destroy = async (query, docid) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'DELETE',
                    url: `${app._couchdb.host}/${app._couchdb.database}/${docid}`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        if (response.statusCode == 200) {
                            resolve(JSON.parse(body));
                        } else {
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lib - couchdb - destroy: ', error);
            throw error;
        }
    }

    return _self;
}