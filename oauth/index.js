'use strict'
/**
 * @name oauth.index
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
 **/
var oauthserver = require('oauth2-server');
var model = require('./model');
var oauth = oauthserver({
    model: model,
    grants: ['password'],
    debug: true,
    accessTokenLifetime: null
});

/**
* Configuration routine
*/
function configure(app) {

    app.all('/oauth/token',
        oauth.grant()
    );

    app.get('/oauth/me', oauth.authorise(), function (req, res) {
        res.json(req.user);
    });

    return {
        registerErrorHandler: function () {
            app.use(oauth.errorHandler());
        }
    };
}


module.exports = {
    pk: model.pub,
    configure: configure,
    authorize: oauth.authorise()
};
