'use strict'
/**
* @name routes.deoartmentroute
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var filedDatacontroller = require('../controllers/filedDatacontroller');
var express = require('express');
var router = express.Router();
var queryBuilder = require('../middleware/queryBuilder');
var authentication=require('../oauth/authorize');
router.route('/')
    .get(authentication.authenticate,queryBuilder.queryBuilder, filedDatacontroller.get)
    .post(authentication.authenticate,filedDatacontroller.post)

router.route('/:id')
    .get(authentication.authenticate,filedDatacontroller.getbyid)
    .put(authentication.authenticate,filedDatacontroller.put)
    .delete(authentication.authenticate,filedDatacontroller.deleted);

module.exports = router;