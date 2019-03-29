module.exports = function(app) {
    const controller = app.controllers.sales;
    app.route('/api/sales')
        .post(controller.checkout)
        .get(controller.getAllSales);
    app.route('/api/sales/timetosoldout/:model/:size')
        .get(controller.getTimeToSoldOut);
}