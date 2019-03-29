const request = require('request');
module.exports = function(app) {
    const _self = {};

    /**
     * createNewDatabase
     * @param {String} colletion
     * @param {Object} call 
     */
    const createNewDatabase = async (colletion) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'PUT',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}`,
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
                        reject(null);
                    } else {
                        if (response.statusCode == 201) {
                            resolve(body);
                        } else {
                            console.error(body);
                            reject(null);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('createNewDatabase:', error);
            throw error;
        }
    }

    /**
     * createDatabaseIfNotExists
     * @param {String} colletion
     * @return {Object} database
     */
    const createDatabaseIfNotExists = async (colletion) => {
        try {
            return await new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}`,
                    headers: {
                        'Accept': 'application/json'
                    },
                    auth: {
                        username: app._couchdb.username,
                        password: app._couchdb.password
                    }
                }, async (error, response, body) => {
                    if (error) {
                        console.error(error);
                        reject(null);
                    } else {
                        if (response.statusCode == 200) {
                            resolve(JSON.parse(body));
                        } else {
                            const created = await createNewDatabase(colletion);
                            if (created) {
                                resolve(created);
                            } else {
                                reject(null);
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error('lin - couchdb - createDatabaseIfNotExists: ', error);
            app.logger.error('lin - couchdb - createDatabaseIfNotExists: ', error);
        }
    }

    /**
     * findAll
     * @param {Object} query
     * @param {String} colletion
     * @return {Object} response
     */
    _self.findAllWithQuery = async (query, colletion) => {
        try {
            await createDatabaseIfNotExists(colletion);
            return await new Promise((resolve, reject) => {
                request({
                    method: 'POST',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}/_find`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    json: true,
                    body: query,
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
                            resolve(body);
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
     * @param {String} colletion
     * @return {Object} response
     */
    _self.findAll = async (colletion) => {
        try {
            await createDatabaseIfNotExists(colletion);
            return await new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}/_all_docs`,
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
     * @param {String} colletion
     * @return {Object} response
     */
    _self.find = async (docid, colletion) => {
        try {
            await createDatabaseIfNotExists(colletion);
            return await new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}/${docid}?latest=true`,
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
                        } else if (response.statusCode == 404) {
                            resolve(null);
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
     * @param {String} colletion
     * @return {Object} response
     */
    _self.createOrUpdate = async (query, docid, colletion) => {
        try {
            await createDatabaseIfNotExists(colletion);
            return await new Promise((resolve, reject) => {
                request({
                    method: 'PUT',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}/${docid}`,
                    json: true,
                    body: query,
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
                            resolve(body);
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
     * @param {String} docid
     * @param {String} rev
     * @param {String} colletion
     * @return {Object} response
     */
    _self.destroy = async (docid, rev, colletion) => {
        try {
            await createDatabaseIfNotExists(colletion);
            return await new Promise((resolve, reject) => {
                request({
                    method: 'DELETE',
                    url: `${app._couchdb.host}/${app._couchdb.database}_${colletion}/${docid}?rev=${rev}`,
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
                        if (response.statusCode == 200 || response.statusCode == 404) {
                            resolve(body);
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