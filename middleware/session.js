const session       = require("express-session");
var MongoDBStore    = require('connect-mongodb-session')(session);

const config        = require("../config/config");

var store = new MongoDBStore({
    uri: config.db,
    databaseName: config.dbName,
    collection: config.sessionsCollection
});
   

store.on('error', function(error) {
    console.log(error);
});

const sessionConfig = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : store,
    cookie: {
        maxAge : config.sessionMaxAge    
    }
}

module.exports = session(sessionConfig);