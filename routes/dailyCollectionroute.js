'use strict'
/**
* @name routes.dailyCollectionroute
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright KP Singh Chundawat
*/

var dailyCollectioncontroller = require('../controllers/dailyCollectioncontroller');
var express = require('express');
var router = express.Router();
var queryBuilder = require('../middleware/queryBuilder');
var authentication=require('../oauth/authorize');
router.route('/')
    .get(authentication.authenticate,queryBuilder.queryBuilder, dailyCollectioncontroller.get)
    .post(authentication.authenticate,dailyCollectioncontroller.post)

router.route('/:id')
    .get(authentication.authenticate,dailyCollectioncontroller.getbyid)
    .put(authentication.authenticate,dailyCollectioncontroller.put)
    .delete(authentication.authenticate,dailyCollectioncontroller.deleted);

module.exports = router;