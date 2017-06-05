/**
* @name helper.mongoose
 *@description  establish connection to mongodb  and based on several  events logging in console.
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/

var config = require('../config/dbconfig.js');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
module.exports = function () {
    console.log('inside the mongoose js');
    console.log('mydburi is', config.dburi);
    var db = mongoose.connect(config.dburi);

    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + config.dburi);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    //configure all models 

    require('../models/index').configure();

    return db;
};