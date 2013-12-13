'use strict';

module.exports = function (app, config) {
    var port = process.env.PORT || config.port || 3000;
    console.log('[express train application listening on %s]', config.port);
    return app.listen(port);
};