'use strict'
/**
* @name controllers.fileddatacontrollers
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/

var fileddatamodel = require('../models/fieldDatainfomodel');
var emimodel = require('../models/emimodel');
var error = require('../handler/error');
var mongoose = require('mongoose');
module.exports.get = function (req, res) {
    fileddatamodel.find(req.options.where)
        .$where(req.options.search).countAsync().then(function (total) {
            fileddatamodel
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
                    return res.status(500).json('Oops!! Something went wrong.');

                });
        }).catch(function (err) {
            if (err) {
                return error.sendMongooseErrorMessage(err, res);
            }
            return res.status(500).json('Oops!! Something went wrong.');
        })

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
    req.body.wardNumber=1;
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
            fileddata.customerzsn = req.body.customerzsn || fileddata.customerzsn;
            fileddata.mobile = req.body.mobile || fileddata.mobile;
            fileddata.aadharno = req.body.aadharno || fileddata.aadharno;
            fileddata.sssmid = req.body.sssmid || fileddata.sssmid;
            fileddata.dob = req.body.dob || fileddata.dob;
            fileddata.enrolledDate = req.body.enrolledDate || fileddata.enrolledDate;
            fileddata.adress = req.body.adress || fileddata.adress;
            fileddata.city = req.body.city || fileddata.city;
            fileddata.pin = req.body.pin || fileddata.pin;

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