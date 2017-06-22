'use strict'
/**
* @name controllers.fileddatacontrollers
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var fileddatamodel = require('../models/fieldDatainfomodel');
var emimodel = require('../models/emimodel');
var error = require('../handler/error');
var mongoose = require('mongoose');
var _ = require('lodash');
module.exports.get = function (req, res) {
    // var wardId = _.map(req.user.ward, '_id')
    if (req.options.where && req.options.where['duplicateaadhar'] == "duplicateaadhar") {
        fileddatamodel.aggregate([{
            '$match': { 'aadharno': { "$exists": true, "$ne": null } }
        }, {
            '$group': {
                '_id': { 'aadharno': '$aadharno' },  //$aadharno is the column name in collection
                'count': { '$sum': 1 },
                'id': { '$push': '$$ROOT' }
            }
        }, {
            '$match': {
                'count': { '$gt': 1 }
            }
        }
        ]).execAsync().then(function (total) {
            fileddatamodel.aggregate([
                {
                    '$match': {
                        'aadharno': { "$exists": true, "$ne": null }
                    }
                }, {
                    "$lookup": {
                        "from": "wards",
                        "localField": "ward",
                        "foreignField": "_id",
                        "as": "ward"
                    }
                },
                { '$unwind': '$ward' },
                {
                    '$group': {
                        '_id': { 'aadharno': '$aadharno' },  //$aadharno is the column name in collection
                        'count': { '$sum': 1 },
                        'id': { '$push': '$$ROOT' }
                    }
                },
                {
                    '$match': {
                        'count': { '$gt': 1 }
                    }
                },
                { '$skip': req.options.pageskip },
                { '$limit': req.options.pagesize }
            ]).execAsync().then(function (list) {
                var result = [];
                var resultobj = {
                    'total': 0,
                    'data': []
                }
                if (list.length > 0) {
                    resultobj.total = total[0].count;
                    resultobj.data = list[0].id;
                }
                result.push(resultobj);
                res.status(200).json(result);
            }).catch(function (err) {
                if (err) {
                    return error.sendMongooseErrorMessage(err, res);
                }
                return res.status(500).json('Oops!! Something went wrong.');
            });
        }).catch(function (err) {
            if (err) {
                return error.sendMongooseErrorMessage(err, res);
            }
            return res.status(500).json('Oops!! Something went wrong.');
        });
    } else {
        fileddatamodel.find(req.options.where)
            .$where(req.options.search).countAsync().then(function (total) {
                fileddatamodel
                    .find(req.options.where)
                    .$where(req.options.search)
                    .sort(req.options.sort)
                    .skip(req.options.pageskip)
                    .limit(req.options.pagesize)
                    .populate('ward', 'name')
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
                        return res.status(500).json('Oops!! Something went wrong.');

                    });
            }).catch(function (err) {
                if (err) {
                    return error.sendMongooseErrorMessage(err, res);
                }
                return res.status(500).json('Oops!! Something went wrong.');
            });
    }


}

module.exports.getbyid = function (req, res) {
    fileddatamodel
        .findByIdAsync(req.params.id).then(function (department) {
            res.status(200).json(department);
        }).catch(function (err) {
            if (err) {
                return error.sendMongooseErrorMessage(err, res);
            }
            res.status(500).json('Oops!! Something went wrong.');
        });
}

module.exports.post = function (req, res) {
    req.body.createdby = req.user.username;
    req.body.modifiedby = req.user.username;
    /// req.body.wardNumber = 1;
    fileddatamodel.createAsync(req.body).then(function (filedData) {
        // if (req.body.isemi == true) {
        //     var months = []
        //     var loanAmount = req.body.principalamount;
        //     var numberOfMonths = req.body.tenure;
        //     var rateOfInterest = req.body.interest;
        //     var monthlyInterestRatio = (rateOfInterest / 100) / 12;
        //     var top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
        //     var bottom = top - 1;
        //     var sp = top / bottom;
        //     var emi = ((loanAmount * monthlyInterestRatio) * sp);
        //     var full = numberOfMonths * emi;
        //     var interest = full - loanAmount;
        //     var int_pge = (interest / full) * 100;
        //     var bb = parseInt(loanAmount);
        //     var int_dd = 0; var pre_dd = 0; var end_dd = 0;
        //     for (var j = 1; j <= numberOfMonths; j++) {
        //         int_dd = bb * ((rateOfInterest / 100) / 12);
        //         pre_dd = emi.toFixed(2) - int_dd.toFixed(2);
        //         end_dd = bb - pre_dd.toFixed(2);
        //         months.push({
        //             fieldData: filedData._id,
        //             monthno: j,
        //             begningBalance: bb.toFixed(2), // emicalc,
        //             emi: emi.toFixed(2),
        //             principle: pre_dd.toFixed(2),
        //             interest: int_dd.toFixed(2),
        //             endingBalance: end_dd.toFixed(2),
        //             ispaid:false,
        //             createdby:req.user.username,
        //             modifiedby:req.user.username
        //         });
        //         bb = bb - pre_dd.toFixed(2);
        //     }
        // emimodel.createAsync(months).then(function (emidata) {
        //   res.status(200).json(filedData);

        // }).catch(function (errs) {
        //     if (errs) {
        //         return error.sendMongooseErrorMessage(errs, res);
        //     }
        //     res.status(500).json('Oops!! Something went wrong.');
        // });
        // }
        // else
        res.status(200).json(filedData);
    }).catch(function (err) {
        if (err) {
            return error.sendMongooseErrorMessage(err, res);
        }
        res.status(500).json('Oops!! Something went wrong.');
    });
}

module.exports.put = function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);

    fileddatamodel
        .findByIdAsync(req.params.id).then(function (fileddata) {
            if (!fileddata) {
                res.status(404).json("No record(s) found.");
            }
            fileddata.name = req.body.name || fileddata.name;
            fileddata.ward = req.body.ward || fileddata.ward;
            fileddata.customerzsn = req.body.customerzsn || fileddata.customerzsn;
            fileddata.mobile = req.body.mobile || fileddata.mobile;
            if (req.body.aadharno)
                fileddata.aadharno = req.body.aadharno;
            else
                fileddata.aadharno = null;
            fileddata.sssmid = req.body.sssmid || fileddata.sssmid;
            fileddata.dob = req.body.dob || fileddata.dob;
            fileddata.enrolledDate = req.body.enrolledDate || fileddata.enrolledDate;
            fileddata.adress = req.body.adress || fileddata.adress;
            fileddata.city = req.body.city || fileddata.city;
            fileddata.pin = req.body.pin || fileddata.pin;
            if (fileddata.isemi && req.body.paidemi > fileddata.paidemi) {
                var currentDate = new Date(fileddata.nextemiDate);
                var differenc = req.body.paidemi - fileddata.paidemi;
                var month = currentDate.getMonth() + differenc;
                currentDate.setMonth(month);
                fileddata.nextemiDate = currentDate;
                fileddata.paidemi = req.body.paidemi || fileddata.paidemi;
                fileddata.emiType = req.body.emiType || fileddata.emiType;

            }
            if (fileddata.isrental==true) {
             fileddata.tenantname=req.body.tenantname || fileddata.tenantname;
             fileddata.tenantaadharnumber=req.body.tenantaadharnumber || fileddata.tenantaadharnumber;
             fileddata.tenantmobilenumber=req.body.tenantmobilenumber || fileddata.tenantmobilenumber;
             
            }
            if (req.body.hasOwnProperty('isactive') && req.body.isactive == false) {
                fileddata.isactive = false;
            }
            else {
                fileddata.isactive = req.body.isactive || fileddata.isactive;
            }
            fileddata.modifiedby = req.user.username || fileddata.modifiedby;
            fileddata.modifieddate = new Date();
            fileddata.saveAsync().then(function (departmnt) {
                return res.status(200).json(departmnt);
            }).catch(function (err) {
                if (err) {
                    return error.sendMongooseErrorMessage(err, res);
                }
                return res.status(500).json('Oops!! Something went wrong.');
            })
        }).catch(function (err) {
            if (err) {
                return error.sendMongooseErrorMessage(err, res);
            }
            return res.status(500).json('Oops!! Something went wrong.');
        });

}

module.exports.deleted = function (req, res) {

    fileddatamodel.findByIdAndRemoveAsync(req.params.id).then(function (fileddata) {
        if (!fileddata) {
            res.status(404).json("No record(s) found.");
        }
        res.status(200).json(fileddata);

    }).catch(function (err) {
        if (err) {
            return error.sendMongooseErrorMessage(err, res);
        }
        res.status(500).json('Oops!! Something went wrong.');

    });
}