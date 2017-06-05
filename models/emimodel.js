'use strict'
/**
* @name models.fieldDatainfomodel
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var emimodel = new schema({
    fieldData: { type: schema.Types.ObjectId, ref: 'filedDatainfo' },
    monthno:{type:Number},
    principleamount:{ type: Number},
    begningBalance:{ type: Number },
    emi:{ type: Number},
    interest:{type:Number},
    endingBalance:{ type: Number},
    emidate:{type:Date},
    ispaid: { type: Boolean, default: false },
    createdby: { type: String, required: [true, 'createdby is required.'] },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String, required: [true, 'modifiedby is required.'] },
    modifieddate: { type: Date, default: Date.now }
});
var filedData = mongoose.model("EmiInfo", emimodel);

module.exports = filedData;