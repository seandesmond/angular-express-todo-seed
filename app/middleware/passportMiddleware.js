'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    BAD_LOGIN_STRING = 'Invalid username or password.';

module.exports = function (app, config, User) {
    var localStrategy = new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            User.findOne({'auth.username': username}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: BAD_LOGIN_STRING }); }
                if (user.authenticate(password)) { return done(null, user); }

                return done(null, false, { message: BAD_LOGIN_STRING });
            });
        }
    ),
        facebookStrategy = new FacebookStrategy(
            {
                clientID: config.facebook.appId,
                clientSecret: config.facebook.appSecret,
                callbackURL: "http://localhost:" + config.port + "/user/facebook-callback"
            },
            function (accessToken, refreshToken, profile, done) {
                User.findOne({'profile.id': profile.id, 'profile.provider': 'facebook'}, function (err, user) {
                    if (err) {
                        done(err);
                    } else if (user) {
                        done(null, user);
                    } else {
                        var newUser = new User({profile: profile});
                        newUser.save(function (err) {
                            if (err) { throw err; }
                            done(null, newUser);
                        });
                    }
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

    passport.setLocals = function (req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
        }

        return next();
    };

    passport.use(localStrategy);
    passport.use(facebookStrategy);

    return passport;
};