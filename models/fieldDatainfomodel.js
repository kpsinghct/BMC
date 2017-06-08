'use strict'
/**
* @name models.fieldDatainfomodel
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
*@copyright KP Singh Chundawat
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var fieldDatainfomodel = new schema({
    name: { type: String },
    ward:{type: schema.Types.ObjectId, ref: 'ward'},
    customerzsn: { type: String },
    mobile: { type: String },
    aadharno: { type: String },
    sssmid: { type: String },
    dob: { type: Date },
    enrolledDate: { type: Date },
    adress: { type: String },
    city: { type: String },
    pin: { type: String },
    isemi: { type: Boolean, default: true },
    principalamount: { type: Number,default:0 },
    downpayment: { type: Number,default:0 },
    tenure: { type: Number,default:0 },
    paidemi: { type: Number,default:0 },
    interest:{type:Number,default:0},
    emidate: { type: Number,default:0 },
    emipermonth:{type:Number,default:0},
    nextemiDate:{type:Date,default:null},
    wardnumber:{type:String},
    createdby: { type: String, required: [true, 'createdby is required.'] },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String, required: [true, 'modifiedby is required.'] },
    modifieddate: { type: Date, default: Date.now }
});
var filedData = mongoose.model("filedDatainfo", fieldDatainfomodel);

module.exports = filedData;