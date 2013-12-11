'use strict';

var express = require('express'),
    path = require('path'),
    connect_timeout = require('connect-timeout'),
    MongoStore = require('connect-mongo')(express);

// Middleware
module.exports = function (app, config, passportMiddleware) {

    // Sessions
    var mongoStore = new MongoStore({
            url: config.mongodb.uri
        }),
        sessionMiddleware = express.session({
            key: config.session.key,
            secret: config.session.secret,
            store: mongoStore
        }),
        errorMiddleware = express.errorHandler({
            dumpExceptions: true,
            showStack: true
        });

    // Middleware stack for all requests
    app.use(express['static'](path.join(__dirname, '../public/app')));  // static files in /public/app
    app.use(connect_timeout({ time: config.request_timeout }));         // request timeouts
    app.use(express.cookieParser());                                    // req.cookies
    app.use(sessionMiddleware);                                         // req.session
    app.use(express.bodyParser());                                      // req.body & req.files
    app.use(express.methodOverride());                                  // '_method' property in body (POST -> DELETE / PUT)
    app.use(passportMiddleware.initialize());
    app.use(passportMiddleware.session());
    app.use(passportMiddleware.setLocals);
    app.use(app.router);                                                // routes in lib/routes.js
    app.use(function (req, res) {                                       // barebones 404 handler
        res.send(404);
    });

    // Handle errors thrown from middleware/routes
    app.use(errorMiddleware);
};
