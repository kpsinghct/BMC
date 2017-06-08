var usermodel = require('../models/usermodel');
var error = require('../handler/error');
var mail = require('../handler/mail');
var mongoose = require('mongoose');
var randomstring = require("randomstring");
var crypto = require('crypto');

module.exports.changepassword = function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    var password = crypto.createHash('sha1').update(req.body.password).digest('hex')
    usermodel.findOneAsync({ 'username': req.body.username, '_id': id, password: password }).then(function (isuser) {
        if (isuser) {
            usermodel
                .findByIdAsync(req.params.id).then(function (user) {
                    if (!user) {
                        return res.json({
                            "statusCode": 404,
                            "message": "No record(s) found.",
                            "data": {}
                        });
                    }

                    if (req.body.hasOwnProperty('newpassword') && req.body.newpassword)
                        user.password = crypto.createHash('sha1').update(req.body.newpassword).digest('hex')
                    user.isfirstTimeLogin = false;
                    user.modifiedby = req.user.username || user.modifiedby;
                    user.modifieddate = new Date();
                    user.saveAsync().then(function (usr) {
                        return res.json({
                            "statusCode": 200,
                            "message": "Password was updated sucessfully.Please re-login.",
                            "data": usr
                        });
                    }).catch(function (err) {
                        if (err) {
                            return error.sendMongooseErrorMessage(err, res);
                        }
                        return res.json({
                            "statusCode": 500,
                            "message": "Oops!! Something went wrong."
                        });
                    })

                }).catch(function (err) {
                    if (err) {
                        return error.sendMongooseErrorMessage(err, res);
                    }
                    return res.json({
                        "statusCode": 500,
                        "message": "Oops!! Something went wrong."
                    });
                });
        }
        else {
            res.status(409).json('Oops! Invalid existing Password.');

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
}

module.exports.forgotpassword = function (req, res) {
    usermodel.findOneAsync({ 'username': req.params.username }).then(function (user) {
        if (user) {
            var password = randomstring.generate({ length: 12, charset: 'alphabetic' });
            user.password = crypto.createHash('sha1').update(password).digest('hex')
            user.isfirstTimeLogin = true;
            user.modifieddate = new Date();
            user.saveAsync().then(function (usr) {
                var messgae = 'Hello <b>' + usr.name + '</b><p>Your account details are </p><br/> <b>Username:- </b><b>'
                    + usr.username + '</b><br/>' + '<b>Password:- </b><b>' + password + '</b>';
                mail.sendmail(usr.username, "Password Reset Sucessfully.", messgae, true);
                return res.json({
                    "statusCode": 200,
                    "message": "Account details sent to your email Id.Please follow the instruction.",
                    "data": usr
                });
            }).catch(function (err) {
                if (err) {
                    return error.sendMongooseErrorMessage(err, res);
                }
                return res.json({
                    "statusCode": 500,
                    "message": "Oops!! Something went wrong."
                });
            })


        }
        else {
            res.status(409).json('Oops! Invalid existing Password.');

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
}