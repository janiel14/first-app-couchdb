module.exports = function(app) {
    const controller = app.controllers.diapers;
    app.route('/api/diapers')
        .post(controller.createOrUpdate)
        .get(controller.getAllDiapers);
    app.route('/api/diapers/:model')
        .get(controller.getDiaper);
    app.route('/api/diapers/:model/:rev')
        .delete(controller.delete);
}
