
'use strict'
/**
* @name routes.index
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/
//var index = require('./index');
var filedDatatroute = require('./filedDatatroute');
var users = require('./users');
var userroute=require('./userroute');
var ward = require('./wardroute');
var dailyCollectionroute = require('./dailyCollectionroute');
var userprofile=require('./userprofileroute');
var authentication = require('../oauth/authorize');
var _ = require('lodash');
module.exports.configure = function (app) {
  app.use('/fieledData', filedDatatroute);
  app.use('/ward', ward);
  app.use('/user',[userroute,userprofile]);
  app.use('/users', users);
  app.use('/dailycollecion',dailyCollectionroute);
}