'use strict'
/**
* @name promise-me
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/
var bird = require('bluebird');
bird.promisifyAll(require('mongoose'));
