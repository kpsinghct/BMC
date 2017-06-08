'use strict'
/**
* @name routes.deoartmentroute
* @author Krishanpal Singh Chundawat <krishanpal.chundawat@zymr.com>
* @version 0.0.0
* @copyright Zymr Systems Pvt. Ltd
*/

var userprofilecontroller = require('../controllers/userprofilecontroller.js');
var express = require('express');
var router = express.Router();
var queryBuilder = require('../middleware/queryBuilder');
var authentication=require('../oauth/authorize');
router.route('/');
router.route('/changepassword/:id')
    .put(authentication.authenticate,userprofilecontroller.changepassword);
    
router.route('/forgotpassword/:username')
    .get(userprofilecontroller.forgotpassword);
module.exports = router;