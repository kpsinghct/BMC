'use strict'
/**
* @name models.dailycollectionmodel
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;

//filedDatainfo
var dailycollectionmodel = new schema({
    fieldId:{type: schema.Types.ObjectId, ref: 'filedDatainfo'},
    eminumber: { type: Number, default: 1 },
    collectionamount: { type: Number},
    createdby: { type: String, required: [true, 'createdby is required.'], default: 'SYSTEM' },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String, required: [true, 'modifiedby is required.'] },
    modifieddate: { type: Date, default: Date.now }
});


var dailycollection = mongoose.model('dailycollection', dailycollectionmodel);


module.exports = dailycollection;