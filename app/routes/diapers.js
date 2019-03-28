module.exports = function(app) {
    const controllers = app.controllers.diapers;
    app.route('/api/diapers')
        .post(controller.createOrUpdate)
        .get(controller.getAllDiapers);
    app.route('/api/diapers/:model')
        .delete(controller.delete)
        .get(controller.getDiaper);
}
