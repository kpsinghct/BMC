'use strict'
/**
* @name oauth.authorize
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/

var decode = require('./model').getAccessToken;
var _ = require('lodash');
var lzstring = require('lz-string');
var model = require('./model');
var usermodel = require('../models/usermodel.js');
var error = require('../handler/error');

module.exports.authenticate = function (req, res, next) {
    var decompressToken = lzstring.decompressFromEncodedURIComponent(req.headers['authorization']);
    var token = decompressToken;
    if (token) {
        decode(token, function (err, data) {
            if (err) {
                next(err);
                return;
            }

            usermodel.findById(data.user._id).then(function (user) {
                if (user) {
                    req.user = user;
                    next();
                    return;
                    // next();
                    // return;
                }
            }).catch(function (err) {
                if (err) {
                    return error.sendMongooseErrorMessage(err, res);
                }
                return res.json({
                    "statusCode": 500,
                    "message": "Oops!! Something went wrong."
                });
            });
        });
    }
    else {
        res.status(401).json({ message: 'Need to pass bearer token authorization header' });
    }
}

//Deprected . No longer exists
module.exports.authorize = function (req, res, next) {
    if (req.user) {
        var requesteduri = req.baseUrl;
        if (_.startsWith(requesteduri, '/'))
            requesteduri = requesteduri.slice(1);

        var allowed = _.filter(req.user.roles, function (roles) {
            return _.filter(roles.permissions, function (m, p) {
                return m == requesteduri;
            }).length > 0;

        }).length;
        if (allowed == 0) {
            res.status(403).json({ message: 'You are not authorized to access this resource' });
        }
        else {
            next();
            return;
        }

    } else {
        res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
}


