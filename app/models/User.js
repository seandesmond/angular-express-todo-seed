'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function (app) {
    var UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true},
        hashed_password: {type: String, required: true},
        salt: {type: String, required: true}
    });

    UserSchema.virtual('password')
        .set(function (password) {
            var user = this;
            user._password = password;
            user.salt = user.makeSalt();
            user.hashed_password = user.encryptPassword(password);
        })
        .get(function () {
            var user = this;
            return user._password;
        });

    UserSchema.method('authenticate', function (plainText) {
        var user = this;
        return user.encryptPassword(plainText) === user.hashed_password;
    });

    UserSchema.method('makeSalt', function () {
        return Math.round((new Date().valueOf() * Math.random())).toString();
    });

    UserSchema.method('encryptPassword', function (password) {
        var user = this;
        return crypto.createHmac('sha1', user.salt).update(password).digest('hex');
    });

    UserSchema.method('generateToken', function () {
        var user = this;
        return crypto.createHash('md5').update(user.username + (new Date().toString())).digest("hex");
    });

    UserSchema.pre('save', function (next) {
        var user = this, pw = user.password || user.hashed_password;
        user.token = user.generateToken();

        if (!pw) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

    return mongoose.model('User', UserSchema);
};