'use strict';

var mongoose = require('mongoose');

module.exports = function () {
    var TodoSchema = new mongoose.Schema({
        text: {type: String},
        dueDate: {type: Date},
        complete: {type: Boolean, 'default': false},
        userId: {type: mongoose.Schema.Types.ObjectId}
    });

    return mongoose.model('Todo', TodoSchema);
};