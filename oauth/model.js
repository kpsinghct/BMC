'use strict'
/**
* @name oauth.model
* @description here I am not directly exporting function because oAuth internally using this(keyword) hence it will give 500.
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var usermodel = require('../models/usermodel');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var fs = require('fs');
var path = require('path');
var lzstring = require('lz-string');

var pk = fs.readFileSync(path.join(__dirname, '..', 'keys', 'development.pem'));
var pub = fs.readFileSync(path.join(__dirname, '..', 'keys', 'development.public.pem'));


//
// oauth2-server cbs
//

function getAccessToken(bearerToken, cb) {
    // var decompressToken = lzstring.decompressFromEncodedURIComponent(bearerToken);
    var payload = jwt.decode(bearerToken, pub, false, 'RS256');
    //var payload =  jwt.decode(decompressToken, pub, false, 'RS256');

    if (payload) {
        cb(null, {
            user: payload,
            expires: null
        });

    } else {
        cb(err, null);
    }
}


function getClient(clientId, clientSecret, cb) {
    cb(null, { clientId: 1 });
};

function grantTypeAllowed(clientId, grantType, cb) {

    if (grantType === 'password') {
        return cb(false, true);
    }

    cb(false, false);
};

function generateToken(type, req, cb) {
    if (req.user && req.user.hasOwnProperty('_doc')) {
        usermodel.findById(req.user._id).populate('ward').execAsync().then(function (user) {
            if (user) {
                user.password='<RESTRICTED>'
                var token = jwt.encode(user, pk, 'RS256');
                var compressToken = lzstring.compressToEncodedURIComponent(token);
                cb(null, compressToken);
            }
        }).catch(function (err) {
            cb(null, null);
        })

    }
    else {
        cb(null, null);
    }
}

function saveAccessToken(token, clientId, expires, userId, cb) {
    cb(null, null);
};

/*
* Required to support password grant type
*/

function getUser(username, password, cb, req) {
    password = crypto.createHash('sha1').update(password).digest('hex')
    usermodel.findOneAsync({ username: username, password: password,isactive:true }).then(function (user) {
        cb(null, user);
    }).catch(function (err) {
        cb(err, null);
    });
};

/*
* Required to support refreshToken grant type.If require then, We will implement this later on.
*/
function saveRefreshToken(token, clientId, expires, userId, cb) {

};

function getRefreshToken(refreshToken, cb) {
};


module.exports = {
    pk: pk,
    pub: pub,
    getAccessToken: getAccessToken,
    getClient: getClient,
    grantTypeAllowed: grantTypeAllowed,
    generateToken: generateToken,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    saveRefreshToken: saveRefreshToken,
    getRefreshToken: getRefreshToken
};
