'use strict'
/**
* @name routes.userroute
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var usercontroller = require('../controllers/usercontroller');
var express = require('express');
var router = express.Router();
var queryBuilder = require('../middleware/queryBuilder');
var authentication=require('../oauth/authorize');
router.route('/')
    .get(authentication.authenticate,queryBuilder.queryBuilder, usercontroller.get)
    .post(authentication.authenticate,usercontroller.post)

router.route('/:id')
    .get(authentication.authenticate,usercontroller.getbyid)
    .put(authentication.authenticate,usercontroller.put)
    .delete(authentication.authenticate,usercontroller.deleted);

module.exports = router;