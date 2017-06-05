'use strict'
/**
* @name models.usermodel
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var usermodel = new schema({
    name: { type: String, required: [true, 'name is required.'] },
    username: { type: String, required: [true, 'username is required.'] },
    password: { type: String, required: [true, "pssword is required."] },
    isfirstTimeLogin: { type: Boolean, default: true },
    isactive: { type: Boolean, default: true },
    createdby: { type: String, required: [true, 'createdby is required.'], default: 'SYSTEM' },
    createddate: { type: Date, default: Date.now },
    modifiedby: { type: String, required: [true, 'modifiedby is required.'] },
    modifieddate: { type: Date, default: Date.now }
});


var user = mongoose.model('user', usermodel);


module.exports = user;