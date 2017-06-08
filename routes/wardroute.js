'use strict'
/**
* @name routes.wardroute
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var wardcontroller = require('../controllers/wardcontroller');
var express = require('express');
var router = express.Router();
var queryBuilder = require('../middleware/queryBuilder');
var authentication=require('../oauth/authorize');
router.route('/')
    .get(authentication.authenticate,queryBuilder.queryBuilder, wardcontroller.get)
    .post(authentication.authenticate,wardcontroller.post)

router.route('/:id')
    .get(authentication.authenticate,wardcontroller.getbyid)
    .put(authentication.authenticate,wardcontroller.put)
    .delete(authentication.authenticate,wardcontroller.deleted);

module.exports = router;