'use strict';

module.exports = function (app, User, passportMiddleware) {
    return {
        getCurrent: [
            function (req, res, next) {
                if (!req.user) {
                    res.send(400);
                } else {
                    User.findOne({_id: req.user.id}, function (err, results) {
                        if (err) {
                            next(err);
                        } else if (results) {
                            res.send(results.getSafeJson());
                        } else {
                            res.send(400);
                        }
                    });
                }
            }],

        authenticateLocal: [
            function (req, res, next) {
                passportMiddleware.authenticate('local', function (err, user) {
                    if (err) { return next(err); }
                    if (!user) {
                        return res.send('Invalid username or password.', 400);
                    }

                    return req.logIn(user, function (err) {
                        if (err) { return next(err); }
                        return res.send(user.getSafeJson(), 200);
                    });
                })(req, res, next);
            }],

        authenticateFacebook: [
            function (req, res, next) {
                passportMiddleware.authenticate('facebook')(req, res, next);
            }],

        authenticateFacebookCallback: [
            function (req, res, next) {
                passportMiddleware.authenticate('facebook', function (err, user) {
                    if (err) { return next(err); }
                    if (!user) { return res.redirect('/login'); }

                    return req.logIn(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect('/todos');
                        }
                    });
                })(req, res, next);
            }],

        create: [
            function (req, res, next) {
                var user = new User(req.body);
                User.findOne({'auth.username': user.auth.username}, function (err, results) {
                    if (err) {
                        next(err);
                    } else if (results) {
                        res.send('A user with this username already exists.', 400);
                    } else {
                        user.save(function (err) {
                            if (err) {
                                next(err);
                            } else {
                                req.logIn(user, function () {
                                    res.send(user.getSafeJson(), 200);
                                });
                            }
                        });
                    }
                });
            }],

        kill: [
            function (req, res) {
                if (req.session) {
                    req.session.destroy(function () {
                        res.send('ok', 200);
                    });
                } else {
                    res.send('ok', 200);
                }
            }],

        exists: [
            function (req, res, next) {
                var username = req.query.username;
                User.findOne({'auth.username': username}, function (err, results) {
                    if (err) {
                        next(err);
                    } else if (results) {
                        res.send(200);
                    } else {
                        res.send(404);
                    }
                });
            }]
    };
};