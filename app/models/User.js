'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    _ = require('lodash');

module.exports = function () {
    var userSchema = new mongoose.Schema({
        auth: {
            username: {type: String, index: {unique: true, sparse: true}},
            hashedPassword: {type: String},
            salt: {type: String},
            apiKey: {type: String, unique: true, index: true}
        },
        profile: {type: mongoose.Schema.Types.Mixed}
    });

    userSchema.index({ 'profile.id': 1 });

    function encrypt(salt, plainText) {
        return crypto.createHmac('sha1', salt).update(plainText).digest('hex');
    }

    userSchema.virtual('auth.password')
        .set(function (password) {
            var user = this;
            user.auth.pw = password;
            user.auth.salt = crypto.randomBytes(64).toString('base64');
            user.auth.hashedPassword = encrypt(user.auth.salt, password);
        })
        .get(function () {
            var user = this;
            return user.auth.pw;
        });

    userSchema.methods.authenticate = function (plainText) {
        return encrypt(this.auth.salt, plainText) === this.auth.hashedPassword;
    };

    userSchema.methods.getSafeJson = function () {
        var user = this.toJSON();

        user.id = user._id;
        delete user._id;
        delete user.__v;
        if (user.auth) {
            delete user.auth.salt;
            delete user.auth.hashedPassword;
        }

        return user;
    };

    userSchema.pre('save', function (next) {
        var user = this, apiKey = {apiKey: uuid.v4()};
        user.auth = user.auth ? _.extend(user.auth, apiKey) : apiKey;
        next();
    });

    return mongoose.model('User', userSchema);
};