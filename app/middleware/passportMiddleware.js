'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BAD_LOGIN_STRING = 'Invalid username or password';

module.exports = function (app, User) {
    var strategy = new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            User.findOne({username: username}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: BAD_LOGIN_STRING }); }
                if (user.authenticate(password)) { return done(null, user); }

                return done(null, false, { message: BAD_LOGIN_STRING });
            });
        }
    );

    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            return done(err, user);
        });
    });

    passport.use(strategy);

    passport.setLocals = function (req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
        }

        return next();
    };

    return passport;
};