'use strict'
/**
* @name models.warmodel
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var wardmodel = new schema({
    name: { type: String, required: [true, 'name is required.'] },
    isactive: { type: Boolean, default: true },
    createdby: { type: String, required: [true, 'createdby is required.'], default: 'SYSTEM' },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String, required: [true, 'modifiedby is required.'] },
    modifieddate: { type: Date, default: Date.now }
});


var ward = mongoose.model('ward', wardmodel);

module.exports = ward;