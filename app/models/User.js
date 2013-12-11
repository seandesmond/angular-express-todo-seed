'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    uuid = require('node-uuid');

module.exports = function () {
    var userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true},
        hashedPassword: {type: String, required: true},
        salt: {type: String, required: true},
        apiKey: {type: String, index: true}
    });

    function encrypt(salt, plainText) {
        return crypto.createHmac('sha1', salt).update(plainText).digest('hex');
    }

    userSchema.virtual('password')
        .set(function (password) {
            var user = this;
            user.pw = password;
            user.salt = crypto.randomBytes(64).toString('base64');
            user.hashedPassword = encrypt(user.salt, password);
        })
        .get(function () {
            var user = this;
            return user.pw;
        });

    userSchema.methods.authenticate = function (plainText) {
        return encrypt(this.salt, plainText) === this.hashedPassword;
    };

    userSchema.methods.getSafeJson = function () {
        var user = this.toJSON();

        user.id = user._id;
        delete user._id;
        delete user.__v;
        delete user.salt;
        delete user.hashedPassword;

        return user;
    };

    userSchema.pre('save', function (next) {
        var user = this, pw = user.password || user.hashedPassword;
        user.apiKey = uuid.v4();

        if (!pw) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });

    return mongoose.model('User', userSchema);
};