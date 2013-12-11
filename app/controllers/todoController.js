'use strict';

module.exports = function (app, Todo) {
    var controller = {};

    controller.preSearch = [
        function (req, res, next) {
            req.query = {userId: req.user.id};
            req.Model = Todo; // Don't think we need this
            return next();
        }
    ];

    controller.preCreate = [
        function (req, res, next) {
            req.body.userId = req.user.id;
            req.Model = Todo; // Don't think we need this
            return next();
        }
    ];

    controller.preUpdate = [
        function (req, res, next) {
            Todo.find({_id: req.params.id, userId: req.user.id}, function (err, results) {
                if (err) { return next(err); }
                if (!results) { return res.send(401); } /* trying to update an entry that isn't yours?!?!?! */
                req.Model = Todo; // Don't think we need this
                return next();
            });
        }
    ];

    controller.preDestroy = [
        function (req, res, next) {
            /* try to find an entry that matches the ID in the uri and belongs to the user who is logged in */
            Todo.find({_id: req.params.id, userId: req.user.id}, function (err, results) {
                if (err) { return next(err); }
                if (!results) { return res.send(401); } /* trying to delete an entry that isn't yours?!?!?! */
                req.Model = Todo; // Don't think we need this
                return next();
            });
        }
    ];

    return controller;
};