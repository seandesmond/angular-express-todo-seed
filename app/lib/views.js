'use strict';

var path = require('path');

module.exports = function (app) {
    //set up view engine
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, '../public/app'));

    // Static locals
    app.locals({
    });
};