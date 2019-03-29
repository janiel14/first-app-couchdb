const frisby = require('frisby');
const _host = process.env.NODE_PORT == null ? `http://localhost:7000` : `http://localhost:${process.env.NODE_PORT}`;

it('should be a get all sales', function () {
    return frisby.get(`${_host}/api/sales`).expect('status', 200);
});

it('should be a create one diaper and sales this diaper and last get a time remaing this sold out diaper and delete this diaper', function() {
    return frisby.setup({
        request: {
            headers: {
                'Content-Type':'application/json'
            }
        }
    }).post(`${_host}/api/diapers`, {
        model: 'Diaper TEST SOULD A',
        description: 'Diaper TEST SOULD A',
        sizes: JSON.stringify([{
            description: 'Size Diaper TEST SOULD A',
            stock: 10
        }])
    }).expect('status', 200).then(function(response) {
        return frisby.setup({
            request: {
                headers: {
                    'Content-Type':'application/json'
                }
            }
        }).post(`${_host}/api/sales`, {
            model: 'Diaper TEST SOULD A',
            size: 'Size Diaper TEST SOULD A',
            qtd: 1
        }).expect('status', 200).then(function(resp) {
            return frisby.get(`${_host}/api/sales/timetosoldout/Diaper TEST SOULD A/Size Diaper TEST SOULD A`).expect('status', 200).then(function(resp) {
                return frisby.get(`${_host}/api/diapers/Diaper TEST SOULD A`).expect('status', 200).then(function(res) {
                    return frisby.del(`${_host}/api/diapers/Diaper TEST SOULD A/${res._json.data._rev}`).expect('status', 200);
                });
            });
        });
    });
});