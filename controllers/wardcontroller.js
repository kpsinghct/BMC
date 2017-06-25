'use strict'
/**
* @name controllers.usercontroller
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var wardmodel = require('../models/wardmodel');
var error = require('../handler/error');
var mongoose = require('mongoose');
module.exports.get = function (req, res) {
    wardmodel.find(req.options.where)
        .$where(req.options.search).countAsync().then(function (total) {
            wardmodel
                .find(req.options.where)
                .$where(req.options.search)
                .sort(req.options.sort)
                .skip(req.options.pageskip)
                .limit(req.options.pagesize)
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
    wardmodel
        .findById(req.params.id)
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
    req.body.modifiedby =req.user.username;
    wardmodel.findOneAsync({ 'name': { $regex: req.body.name, $options: "i" } }).then(function (isward) {
        if (!isward) {
            wardmodel.createAsync(req.body).then(function (ward) {
                return res.json({
                    "statusCode": 201,
                    "message": "Project was created successfully.",
                    "data": ward
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
            res.status(409).json('Oops! Ward already exist.');

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
    wardmodel.findOneAsync({ 'name': { $regex: req.body.name, $options: "i" }, '_id': { '$ne': id } }).then(function (isuser) {
        if (!isuser) {
            wardmodel
                .findByIdAsync(req.params.id).then(function (ward) {
                    if (!ward) {
                        return res.json({
                            "statusCode": 404,
                            "message": "No record(s) found.",
                            "data": {}
                        });
                    }

                    ward.name = req.body.name || ward.name;

                    if (req.body.hasOwnProperty('isactive') && req.body.isactive == false) {
                        ward.isactive = false;
                    }
                    else {
                        ward.isactive = req.body.isactive || ward.isactive;
                    }
                    ward.modifiedby = req.body.modifiedby || ward.modifiedby;
                    ward.modifieddate = new Date();
                    ward.saveAsync().then(function (wrd) {
                        return res.json({
                            "statusCode": 200,
                            "message": "Project was updated sucessfully.",
                            "data": wrd
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
            res.status(409).json('Oops! Project is already exist.');

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

module.exports.deleted = function (req, res) {
    wardmodel.findByIdAndRemoveAsync(req.params.id).then(function (ward) {
        if (!ward) {
            return res.json({
                "statusCode": 404,
                "message": "No record(s) found.",
                "data": {}
            });
        }
        return res.json({
            "statusCode": 204,
            "message": "Project was deleted successfully.",
            "data": ward
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