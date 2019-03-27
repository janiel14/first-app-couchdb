# first-app-couchdb
My first app in couchDB

### Requirements
- couchDB >=1.2.18
- Node JS >=10.15

### Important
- Couch DB using basic authentication

### How to deploy in Linux
- export NODE_ENV=${enviroment} ex: production
- export NODE_DEBUG=${debug} ex: false
- export NODE_PORT=${port_run_app}
- export NODE_COUCHDB_HOST=${ip_couch_db} ex: http://10.70.0.15:5984
- export NODE_COUCHDB_USER=${user_couch_db} ex: root
- export NODE_COUCHDB_PASS=${pass_couch_db} ex: q1w2e3r4
- export NODE_COUCHDB_DBNAME=${dbname} ex: look_after
- npm install
- bower install
- npm start

### How to deploy in Windows
- SET NODE_ENV=${enviroment} ex: production
- SET NODE_DEBUG=${debug} ex: false
- SET NODE_PORT=${port_run_app}
- SET NODE_COUCHDB_HOST=${ip_couch_db} ex: http://10.70.0.15:5984
- SET NODE_COUCHDB_USER=${user_couch_db} ex: root
- SET NODE_COUCHDB_PASS=${pass_couch_db} ex: q1w2e3r4
- SET NODE_COUCHDB_DBNAME=${dbname} ex: look_after
- npm install
- bower install
- npm start
