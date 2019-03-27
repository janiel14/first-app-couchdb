const express = require("express");
const consign = require("consign");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const logger = require("./logger")();
const helpers = require("./helpers");
const expressValidator = require('express-validator');
const compression = require('compression');
const couchdb = require('./couchdb');
module.exports = function() {
    const app = express();
    app.logger = logger.getLogger();
    app.debugging = logger.getDebug();
    app.helpers = helpers(app);
    app.helpers.checkBasicFolders();
    app.set('port', process.env.NODE_PORT || 7000);
    app.env = process.env.NODE_ENV || 'development';
    app.debug = process.env.NODE_DEBUG || false;
    app._couchdb =  {
        host: process.env.NODE_COUCHDB_HOST || "http://10.70.0.15:5984",
        username: process.env.NODE_COUCHDB_USER || "root",
        password: process.env.NODE_COUCHDB_PASS || "q1w2e3r4",
        database: process.env.NODE_COUCHDB_DBNAME || "look_after"
    };
    app.use(compression());
    app.use(bodyParser.urlencoded({limit: '1024mb',extended: true}));
    app.use(bodyParser.json({limit: '1024mb'}));
    app.use(require('method-override')());
    app.use(cors());
    app.use(expressValidator());
    app.use(helmet());
    app.use(express.static('./public'));
    app.couchdb = new couchdb(app);
    app.couchdb.createDatabaseIfNotExists((response) => {
        if (response) {
            consign({cwd: 'app', verbose: false})
                .include("models")
                .then("controllers")
                .then("routes")
                .into(app);
            app.get('*', (req, res) => {
                res.status(200).json({
                    message: "I m working hard, please don't distubed!"
                });
            });    
        } else {
            console.error("Database couchdb is essencial to work this application, connection to couchdb failed try again!!!");
            process.exit(0);
        }
    });        
    return app;
}