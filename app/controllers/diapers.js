module.exports = function(app) {
    const _self = {};
    const Diapers = app.models.diapers;
    
    /**
    * createOrUpdate
    * @param {Object} req
    * @param {Object} res
    * @route /api/diapers
    * @method POST
    */
    _self.createOrUpdate = async (req, res) {
        try {
            req.check('model', 'Not found model').notEmpty();
            req.check('description', 'Not found description').notEmpty();
            req.check('sizes', 'Not sizes description').notEmpty();
            const errors = req.asyncValidationErrors();
            if (erros) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const ds = await app.couchdb.couchdb.create('diapers', req.body);
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
    * @route /api/diapers/:model
    * @method DELETE
    */
    _self.delete = async (req, res) {
        try {
            req.check('model', 'Not found model').notEmpty();
            const errors = req.asyncValidationErrors();
            if (erros) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const ds = await app.couchdb.couchdb.destroy(req.params.model);
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
    _self.getDiaper = async (req, res) {
        try {
            req.check('model', 'Not found model').notEmpty();
            const errors = req.asyncValidationErrors();
            if (erros) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const ds = await app.couchdb.couchdb.find(req.params.model);
                if (ds) {
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
    _self.getAllDiapers = async (req, res) {
        try {
            const ds = await app.couchdb.couchdb.findAll();
            if (ds) {
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
