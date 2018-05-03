const {
  user,
  pwd,
  host,
  port,
  db,
} = require('config').mongodb;

const mongoUrl = `${user}:${pwd}@${host}:${port}/${db}`;

const DB = require('monk')(mongoUrl);

if (process.env.NODE_ENV !== 'production') {
  // DEBUG="monk:*" node services/cqrs/taskHandlers/student.js
  DB.addMiddleware(require('monk-middleware-debug'));
}

module.exports = DB;

/**
 *
use cf_view

db.createUser(
  {
    user: "cf_view",
    pwd: "tongji2016_mongo",
    roles: [
       { role: "readWrite", db: "cf_view" }
    ]
  }
)

use cf-agenda
db.createUser(
  {
    user: "cf_scheduletask",
    pwd: "tongji2016",
    roles: [
       { role: "readWrite", db: "cf-agenda" }
    ]
  }
)

use admin
db.createUser(
  {
    user: "cfAdmin",
    pwd: "Sjtu2016",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
 */
