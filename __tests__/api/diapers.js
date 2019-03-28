const frisby = require('frisby');
const _host = process.env.NODE_PORT == null ? `http://localhost:7000` : `http://localhost:${process.env.NODE_PORT}`;

it('should be a get all diapers', function () {
    return frisby.get(`${_host}/api/diapers`).expect('status', 200);
});

it('should be a post diapers and get one and after delete one diaper', function() {
    return frisby.setup({
        request: {
            headers: {
                'Content-Type':'application/json'
            }
        }
    }).post(`${_host}/api/diapers`, {
        model: 'Diaper TEST C',
        description: 'Diapers description for TEST C',
        sizes: JSON.stringify([{
            description: 'Size TEST C',
            stock: 10
        }])
    }).expect('status', 200).then(function(response) {
        return frisby.get(`${_host}/api/diapers/Diaper TEST C`).expect('status', 200).then(function(res) {
            return frisby.del(`${_host}/api/diapers/Diaper TEST C/${res._json.data._rev}`).expect('status', 200);
        });
    });
});