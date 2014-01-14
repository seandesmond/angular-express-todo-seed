'use strict';

//var resource = require('express-resource');

module.exports = function (app, middleware, passportMiddleware, apiController, homeController, userController, todoController, models, User) {

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /* Make sure this person is logged in. If they aren't, return a 401.
     This let's angular know to go to a login page. */
    function ensureAuthenticated(req, res, next) {
        /* We'll need to try the api key authorization here if there is no session avail. This
         * should really go into a custom passport strategy. For another day... */
        if (!req.isAuthenticated()) {
            var apiKey = req.headers.apiKey || req.headers.apikey || req.headers.ApiKey;
            if (apiKey) {
                User.findOne({apiKey: apiKey}, function (err, results) {
                    if (err) {
                        next(err);
                    } else if (results) {
                        req.user = {id: results.id};
                        next();
                    } else {
                        res.send(401);
                    }
                });
            } else {
                res.send(401);
            }
        } else {
            next();
        }
    }

    // Home
    //app.resource(app.controllers.home);
    app.get(/(^\/(login|register|todos)?)$/, homeController.index);

    //User
    app.get('/user', userController.getCurrent);
    app.head('/user', userController.exists);
    app.post('/user/login', userController.authenticateLocal);
    app.get('/user/facebook-login', userController.authenticateFacebook);
    app.get('/user/facebook-callback', userController.authenticateFacebookCallback);
    app.get('/user/twitter-login', userController.authenticateTwitter);
    app.get('/user/twitter-callback', userController.authenticateTwitterCallback);
    app.get('/user/google-login', userController.authenticateGoogle);
    app.get('/user/google-callback', userController.authenticateGoogleCallback);
    app.post('/user/register', userController.create);
    app.post('/user/logout', userController.kill);

    /* Rather than go right to the API routes below, we need to do a few things first, like say what Users Todos
     to return and stamp the Todos they create with their ID.  Once we've dne these things (in the "pre" functions),
     we end up invoking the generic api methods.  Cool, right? */
    app.get('/api/Todo', ensureAuthenticated, todoController.preSearch, apiController.search);
    app.post('/api/Todo', ensureAuthenticated, todoController.preCreate, apiController.create);
    app.post('/api/Todo/:id', ensureAuthenticated, todoController.preUpdate, apiController.update);
    app.del('/api/Todo/:id', ensureAuthenticated, todoController.preDestroy, apiController.destroy);

    //Generic restful api for all models - if previous routes are not matched, will fall back to these
    //See below, which adds param middleware to load & set req.Model based on :model argument
    app.get('/api/:model', apiController.search);
    app.post('/api/:model', apiController.create);
    app.get('/api/:model/:id', apiController.read);
    app.post('/api/:model/:id', apiController.update);
    app.del('/api/:model/:id', apiController.destroy);

    //whenever a router parameter :model is matched, this is run
    app.param('model', function (req, res, next, model) {
        //TODO: what instead?
        var Model = models[model] || models[toTitleCase(model)];
        if (Model === undefined) {
            //if the request is for a model that does not exist, 404
            return res.send(404);
        }

        req.Model = Model;
        return next();
    });
};