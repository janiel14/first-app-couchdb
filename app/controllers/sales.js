module.exports = function(app) {
    const _self = {};
    const _colletionSales = "sales";
    const _colletionDiapers = "diapers";
    const Sales = app.models.sales;
    const Diapers = app.models.diapers;
    const Sizes = app.models.sizes;

    /**
     * stockDownDiapers
     * @param {Object} diaper 
     * @return {Object} diaperUpdated
     */
    const stockDownDiapers = async (diaper) => {
        try {
            await app.couchdb.destroy(diaper.model, diaper._rev, _colletionDiapers);
            Diapers.model = diaper.model;
            Diapers.description = diaper.description;
            Diapers.sizes = [];
            const listSiezes = diaper.sizes;
            if (listSiezes.length > 0) {
                listSiezes.forEach(element => {
                    Sizes.description = element.description;
                    Sizes.stock = element.stock
                    Diapers.sizes.push(Sizes);
                });
            }
            return await app.couchdb.createOrUpdate(Diapers, Diapers.model, _colletionDiapers);
        } catch (error) {
            console.error("app - controllers - sales - stockDownDiapers: ", error);
        }
    }

    /**
     * @param {Object} req
     * @param {Object} res
     * @route /api/sales
     * @method POST
     */
    _self.checkout = async (req, res) => {
        try {
            req.checkBody('model', 'Not found model').notEmpty();
            req.checkBody('size', 'Not found size').notEmpty();
            req.checkBody('qtd', 'Not found qtd').notEmpty();
            const errors = await req.asyncValidationErrors();
            if (errors) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const now = new Date();
                Sales.request = app.helpers.randomString(25);
                Sales.model = req.body.model;
                Sales.size = req.body.size;
                Sales.qtd = req.body.qtd;
                Sales.date = now.getTime();
                const diaper = await app.couchdb.find(req.body.model, _colletionDiapers);
                if (diaper) {
                    const size = diaper.sizes.find((item) => {
                        return item.description == Sales.size;
                    });
                    if (size) {
                        if (size.stock > Sales.qtd) {
                            diaper.sizes.map((item) => {
                                if (item.description === Sales.size) {
                                    item.stock = (parseInt(item.stock) - parseInt(Sales.qtd));

                                }
                            });
                            const diaperUpdated = await stockDownDiapers(diaper);
                            if (diaperUpdated) {
                                const saved = await app.couchdb.createOrUpdate(Sales, Sales.request, _colletionSales);
                                if (saved) {
                                    res.status(200).json({
                                        message: 'Diapers model sold with success',
                                        data: Sales
                                    });
                                } else {
                                    res.status(500).json({
                                        message: "Failed on registed sold for this model!",
                                        data: Sales
                                    });
                                }
                            } else {
                                res.status(500).json({
                                    message: "Failed on stock down for this model!",
                                    data: Sales
                                });
                            }
                        } else {
                            res.status(500).json({
                                message: "Don't have stock of size for this model to sold!",
                                data: Sales
                            });
                        }
                    } else {
                        res.status(500).json({
                            message: 'Size not found into model',
                            data: Sales
                        });
                    }
                } else {
                    res.status(500).json({
                        message:'Model diapers not found into catalog',
                        data: Sales
                    });
                }
            }
        } catch (error) {
            console.error("app - controllers - sales - checkout: ", error);
            app.logger.error("app - controllers - sales - checkout: " + error);
            res.status(500).json({
                message: 'Internal server error',
                data: error
            });
        }
    }

    /**
     * getAllSales
     * @param {Object} req
     * @param {Object} res
     * @route /api/sales
     * @method GET
     */
    _self.getAllSales = async (req, res) => {
        try {
            const ds = await app.couchdb.findAll(_colletionSales);
            if (ds) {
                await Promise.all(ds.rows.map(async (item) => {
                    item.colletion = await app.couchdb.find(item.id, _colletionSales);
                }));
                res.status(200).json({
                    message: 'Sales get success',
                    data: ds
                });
            } else {
                res.status(500).json({
                   message: 'Internal server error',
                   data: error
                });
            }
        } catch (error) {
            console.error("app - controllers - sales - getAllSales: ", error);
            app.logger.error("app - controllers - sales - getAllSales: " + error);
            res.status(500).json({
                message: 'Internal server error',
                data: error
            });
        }
    }

    /**
     * getTimeToSoldOut
     * @param {Object} req
     * @param {Object} res
     * @route /api/sales/timetosoldout/:model/:size
     * @method GET
     */
    _self.getTimeToSoldOut = async (req, res) => {
        try {
            req.checkParams('model', 'Not found model').notEmpty();
            req.checkParams('size', 'Not found size').notEmpty();
            const errors = await req.asyncValidationErrors();
            if (errors) {
                res.status(500).json({
                    message: 'Params not found!',
                    data: errors
                });
            } else {
                const query = {
                    selector: {
                        model: req.params.model,
                        size: req.params.size
                    },
                    fields: ["_id", "_rev","request","model","size","qtd","date"]
                };
                const sales = await app.couchdb.findAllWithQuery(query, _colletionSales);
                if (sales) {
                    let sumTime = 0;
                    for (let i = 0; i < sales.docs.length; i++) {
                        const element = sales.docs[i];
                        sumTime = parseInt(sumTime) + parseInt(element.date);
                    }
                    let avgtime = (parseInt(sumTime)/parseInt(sales.docs.length)).toFixed(0);
                    const diaper = await app.couchdb.find(req.params.model, _colletionDiapers);
                    if (diaper) {
                        const size = diaper.sizes.find((item) => {
                            return item.description === req.params.size;
                        });
                        if (size) {
                            if (size.stock > 0) {
                                res.status(200).json({
                                    message: 'Time remaing to model and size sold out',
                                    data: {
                                        time_remaing: (parseInt(size.stock) * parseInt(avgtime)).toFixed(0),
                                        stock: size.stock
                                    }
                                });
                            } else {
                                res.status(200).json({
                                    message: 'Stok for this model and size is 0',
                                    data: {
                                        time_remaing: 0,
                                        stock: 0 
                                    }
                                });
                            }
                        } else {
                            res.status(500).json({
                                message: 'Size not found into model',
                                data: diaper
                            });                            
                        }
                    } else {
                        res.status(500).json({
                            message: 'Model not found in diapers catalog',
                            data: diaper
                        });
                    }
                } else {
                    res.status(500).json({
                        message: 'Sales not found for this model and size',
                        data: sales
                    });
                }
            }
        } catch (error) {
            console.error("app - controllers - sales - getTimeToSoldOut: ", error);
            app.logger.error("app - controllers - sales - getTimeToSoldOut: " + error);
            res.status(500).json({
                message: 'Internal server error',
                data: error
            });
        }
    }

    return _self;
}