'use strict'
/**
* @name controllers.usercontroller
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/

var usermodel = require('../models/usermodel');
var error = require('../handler/error');
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
                .populate('roles', '-__v')
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
        .populate('roles', '-__v')
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

    usermodel.createAsync(req.body).then(function (skill) {
        return res.json({
            "statusCode": 201,
            "message": "user was created successfully.",
            "data": skill
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

module.exports.patch = function (req, res) {
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

            if (req.body.hasOwnProperty('isactive') && req.body.isactive == false) {
                user.isactive = false;
            }
            else {
                user.isactive = req.body.isactive || user.isactive;
            }
            user.modifiedby = req.body.modifiedby || user.modifiedby;
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