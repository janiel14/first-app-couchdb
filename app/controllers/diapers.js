module.exports = function(app) {
    const _self = {};
    const _colletion = "diapers";
    const Diapers = app.models.diapers;
    const Sizes = app.models.sizes;
    
    /**
    * createOrUpdate
    * @param {Object} req
    * @param {Object} res
    * @route /api/diapers
    * @method POST
    */
    _self.createOrUpdate = async (req, res) => {
        try {
            req.checkBody('model', 'Not found model').notEmpty();
            req.checkBody('description', 'Not found description').notEmpty();
            req.checkBody('sizes', 'Not found sizes ').notEmpty();
            const errors = await req.asyncValidationErrors();
            if (errors) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                Diapers.model = req.body.model;
                Diapers.description = req.body.description;
                Diapers.sizes = [];
                const listSiezes = JSON.parse(req.body.sizes);
                if (listSiezes.length > 0) {
                    listSiezes.forEach(element => {
                        Sizes.description = element.description;
                        Sizes.stock = element.stock
                        Diapers.sizes.push(Sizes);
                    });
                }
                const exists = await app.couchdb.find(Diapers.model, _colletion);
                if (exists) {
                    await app.couchdb.destroy(Diapers.model, exists._rev, _colletion);
                }
                const ds = await app.couchdb.createOrUpdate(Diapers, Diapers.model, _colletion);
                if (ds) {
                    res.status(200).json({
                        message: 'Diapers save or updated success',
                        data: ds
                    });
                } else {
                    res.status(500).json({
                       message: 'Internal server error',
                       data: error
                    });
                }
            }
        } catch(error) {
            console.error('app - controllers - diapers - creteOrUpdate: ', error);
            app.logger.error('app - controllers - diapers - creteOrUpdate: ' + error);
            res.status(500).json({
               message: 'Internal server error',
               data: error
            });
        }
    }
    
    /**
    * delete
    * @param {Object} req
    * @param {Object} res
    * @route /api/diapers/:model/:rev
    * @method DELETE
    */
    _self.delete = async (req, res) => {
        try {
            req.checkParams('model', 'Not found model').notEmpty();
            const errors = await req.asyncValidationErrors();
            if (errors) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const ds = await app.couchdb.destroy(req.params.model, req.params.rev, _colletion);
                if (ds) {
                    res.status(200).json({
                        message: 'Diapers deleted success',
                        data: ds
                    });
                } else {
                    res.status(500).json({
                       message: 'Internal server error',
                       data: error
                    });
                }
            }
        } catch(error) {
            console.error('app - controllers - diapers - delete: ', error);
            app.logger.error('app - controllers - diapers - delete: ' + error);
            res.status(500).json({
               message: 'Internal server error',
               data: error
            });
        }
    }
    
    /**
    * getDiaper
    * @param {Object} req
    * @param {Object} res
    * @route /api/diapers/:model
    * @method GET
    */
    _self.getDiaper = async (req, res) => {
        try {
            req.checkParams('model', 'Not found model').notEmpty();
            const errors = await req.asyncValidationErrors();
            if (errors) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const ds = await app.couchdb.find(req.params.model, _colletion);
                if (ds) {
                    res.status(200).json({
                        message: 'Diapers get success',
                        data: ds
                    });
                } else {
                    res.status(500).json({
                       message: 'Internal server error',
                       data: ds
                    });
                }
            }
        } catch(error) {
            console.error('app - controllers - diapers - getDiaper: ', error);
            app.logger.error('app - controllers - diapers - getDiaper: ' + error);
            res.status(500).json({
               message: 'Internal server error',
               data: error
            });
        }
    }
    
    /**
    * getAllDiapers
    * @param {Object} req
    * @param {Object} res
    * @route /api/diapers
    * @method GET
    */
    _self.getAllDiapers = async (req, res) => {
        try {
            const ds = await app.couchdb.findAll(_colletion);
            if (ds) {
                await Promise.all(ds.rows.map(async (item) => {
                    item.colletion = await app.couchdb.find(item.id, _colletion);
                }));
                res.status(200).json({
                    message: 'Diapers get success',
                    data: ds
                });
            } else {
                res.status(500).json({
                   message: 'Internal server error',
                   data: error
                });
            }
        } catch(error) {
            console.error('app - controllers - diapers - getAllDiapers: ', error);
            app.logger.error('app - controllers - diapers - getAllDiapers: ' + error);
            res.status(500).json({
               message: 'Internal server error',
               data: error
            });
        }
    }
    
    return _self;
}
