
'use strict'
/**
* @name routes.index
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/
//var index = require('./index');
var filedDatatroute = require('./filedDatatroute');
var users = require('./users');
var authentication = require('../oauth/authorize');
var _ = require('lodash');
module.exports.configure = function (app) {
  app.use('/fieledData', filedDatatroute);
  app.use('/users', users);
}