'use strict'
/**
* @name controllers.usercontroller
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var dailycollectionmodel = require('../models/dailycollectionmodel');
var fileddatamodel = require('../models/fieldDatainfomodel');
var error = require('../handler/error');
var mongoose = require('mongoose');
module.exports.get = function (req, res) {
    console.log(req.options.where);
    
    dailycollectionmodel.find(req.options.where)
        .$where(req.options.search).countAsync().then(function (total) {
            dailycollectionmodel
                .find(req.options.where)
                .$where(req.options.search)
                .sort(req.options.sort)
                .skip(req.options.pageskip)
                .limit(req.options.pagesize)
                .populate([{
                    path: 'fieldId',
                    model: 'filedDatainfo',
                    populate: {
                        path: 'ward',
                        model: 'ward'
                    }
                }])
                // .populate('fieldId.ward', '-__v')
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
    dailycollectionmodel
        .findById(req.params.id)
        .then(function (collection) {
            if (!collection) {
                return res.json({
                    "statusCode": 404,
                    "message": "No record(s) found.",
                    "data": {}
                });
            }
            return res.json({
                "statusCode": 200,
                "data": collection
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
    req.body.modifiedby = req.user.username;
    req.body.createdby = req.user.username;
    var fieldId = req.body.fieldId;
    req.body.fieldId = mongoose.Types.ObjectId(req.body.fieldId);
    dailycollectionmodel.createAsync(req.body).then(function (ward) {
        fileddatamodel
            .findByIdAsync(fieldId).then(function (fileddata) {
                if (!fileddata) {
                    res.status(404).json("No record(s) found.");
                }

                fileddata.paidemi = req.body.eminumber
                fileddata.saveAsync().then(function (filedss) {
                    return res.json({
                        "statusCode": 201,
                        "message": "collection details for customer submited successfully.",
                        "data": ward
                    });
                }).catch(function (err) {
                    if (err) {
                        return error.sendMongooseErrorMessage(err, res);
                    }
                    return res.status(500).json('Oops!! Something went wrong.');
                });
            }).catch(function (rrr) {
                if (err) {
                    return error.sendMongooseErrorMessage(rrr, res);
                }
                return res.status(500).json('Oops!! Something went wrong.');
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

module.exports.put = function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    req.body.fieldId = mongoose.Types.ObjectId(req.body.fieldId);
    dailycollectionmodel
        .findByIdAsync(req.params.id).then(function (collection) {
            if (!collection) {
                return res.json({
                    "statusCode": 404,
                    "message": "No record(s) found.",
                    "data": {}
                });
            }

            collection.fieldId = req.body.fieldId || collection.fieldId;
            collection.eminumber = req.body.eminumber || collection.eminumber;
            collection.collectionamount = req.body.collectionamount || collection.collectionamount;
            collection.wardId= req.body.wardId || collection.wardId;
            collection.modifiedby = req.body.modifiedby || collection.modifiedby;
            collection.modifieddate = new Date();
            collection.saveAsync().then(function (colletn) {
                fileddatamodel
                    .findByIdAsync(req.body.fieldId).then(function (fileddata) {
                        if (!fileddata) {
                            res.status(404).json("No record(s) found.");
                        }

                        fileddata.paidemi = req.body.eminumber
                        fileddata.saveAsync().then(function (filedss) {
                            return res.json({
                                "statusCode": 200,
                                "message": "collection details for customer updated sucessfully.",
                                "data": colletn
                            });
                        }).catch(function (err) {
                            if (err) {
                                return error.sendMongooseErrorMessage(err, res);
                            }
                            return res.status(500).json('Oops!! Something went wrong.');
                        });
                    }).catch(function (rrr) {
                        if (err) {
                            return error.sendMongooseErrorMessage(rrr, res);
                        }
                        return res.status(500).json('Oops!! Something went wrong.');
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
    dailycollectionmodel.findByIdAndRemoveAsync(req.params.id).then(function (ward) {
        if (!ward) {
            return res.json({
                "statusCode": 404,
                "message": "No record(s) found.",
                "data": {}
            });
        }
        return res.json({
            "statusCode": 204,
            "message": "user was deleted successfully.",
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