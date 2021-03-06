'use strict'
/**
* @name controllers.usercontroller
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var usermodel = require('../models/usermodel');
var error = require('../handler/error');
var mail = require('../handler/mail');
var mongoose = require('mongoose');
var randomstring = require("randomstring");
var crypto = require('crypto');
module.exports.get = function (req, res) {
    usermodel.find(req.options.where)
        .$where(req.options.search).countAsync().then(function (total) {
            usermodel
                .find(req.options.where)
                .select('-__v')
                .$where(req.options.search)
                .sort(req.options.sort)
                .skip(req.options.pageskip)
                .limit(req.options.pagesize)
                .populate('ward', '-__v')
                .execAsync().then(function (list) {
                    var result = [{
                        'total': total,
                        'data': list
                    }]

                    res.status(200).json(result);
                }).catch(function (err) {
                    if (err) {
                        return error.sendMongooseErrorMessage(err, res);
                    }
                    return res.json({
                        "statusCode": 500,
                        "message": "Oops!! Something went wrong."
                    });
                });
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

module.exports.getbyid = function (req, res) {
    usermodel
        .findById(req.params.id)
        .select('-__v')
        .populate('ward', '-__v')
        .execAsync()
        .then(function (user) {
            if (!user) {
                return res.json({
                    "statusCode": 404,
                    "message": "No record(s) found.",
                    "data": {}
                });
            }
            return res.json({
                "statusCode": 200,
                "data": user
            });
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

module.exports.post = function (req, res) {
    usermodel.findOneAsync({ 'username':{$regex:req.body.username,$options: "i"}  }).then(function (isuser) {
        if (!isuser) {
            req.body.createdby = req.user.username;
            req.body.modifiedby = req.user.username;
            var password = randomstring.generate({ length: 12, charset: 'alphabetic' });
            req.body.password = crypto.createHash('sha1').update(password).digest('hex')
            req.body.isfirstTimeLogin = true;
            usermodel.createAsync(req.body).then(function (user) {
                var messgae = 'Welcome <b>' + user.name + '</b><p>Your account details are </p><br/> <b>Username:- </b><b>'
                    + user.username + '</b><br/>' + '<b>Password:- </b><b>' + password + '</b>';
                mail.sendmail(user.username, "Resitration Sucessfull", messgae, true);
                return res.json({
                    "statusCode": 201,
                    "message": "user was created successfully.",
                    "data": user
                });
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
            res.status(409).json('Oops! Username already exist.');
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

module.exports.put = function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    usermodel.findOneAsync({ 'username': {$regex:req.body.username,$options: "i"} , '_id': { '$ne': id } }).then(function (isuser) {
        if (!isuser) {
            usermodel
                .findByIdAsync(req.params.id).then(function (user) {
                    if (!user) {
                        return res.json({
                            "statusCode": 404,
                            "message": "No record(s) found.",
                            "data": {}
                        });
                    }
                    user.name = req.body.name || user.name;
                    user.role = req.body.role || user.role;
                    user.ward = req.body.ward || user.ward;
                    if (req.body.hasOwnProperty('isactive') && req.body.isactive == false) {
                        user.isactive = false;
                    }
                    else {
                        user.isactive = req.body.isactive || user.isactive;
                    }
                    user.modifiedby = req.user.username || user.modifiedby;
                    user.modifieddate = new Date();
                    user.saveAsync().then(function (usr) {
                        return res.json({
                            "statusCode": 200,
                            "message": "user was updated sucessfully.",
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
        else{
            res.status(409).json('Oops! Username already exist.');
        }
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

module.exports.deleted = function (req, res) {
    usermodel.findByIdAndRemoveAsync(req.params.id).then(function (user) {
        if (!user) {
            return res.json({
                "statusCode": 404,
                "message": "No record(s) found.",
                "data": {}
            });
        }
        return res.json({
            "statusCode": 204,
            "message": "user was deleted successfully.",
            "data": user
        });
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