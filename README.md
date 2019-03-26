# first-app-couchdb
My first app in couchDB

### Requirements
- couchDB >=1.2.18
- Node JS >=10.15

### Important
- Couch DB using basic authentication

### How to deploy in Linux
- export NODE_PORT=${port_run_app}
- export NODE_COUCHDB_HOST=${ip_couch_db}
- export NODE_COUCHDB_USER=${user_couch_db}
- export NODE_COUCHDB_PASS=${pass_couch_db}
- export NODE_COUCHDB_DBNAME=${dbname}
- npm install
- bower install
- npm start

### How to deploy in Windows
- SET NODE_PORT=${port_run_app}
- SET NODE_COUCHDB_HOST=${ip_couch_db}
- SET NODE_COUCHDB_USER=${user_couch_db}
- SET NODE_COUCHDB_PASS=${pass_couch_db}
- SET NODE_COUCHDB_DBNAME=${dbname}
- npm install
- bower install
- npm start
