'use strict'
/**
* @name models.index
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/

var crypto = require('crypto');
module.exports.configure = function () {
    require('./fieldDatainfomodel');
    var user = require('./usermodel');
    //seeding into database

    user.findOne({ 'username': 'blackroot@blackroot.in' }).then(function (users) {
                    if (!users) {
                        var password = crypto.createHash('sha1').update('blackroot@123').digest('hex')
                        var usr = new user({ name:'SYSTEM',username: "blackroot@blackroot.in", password: password,
                         isfirstTimeLogin: false, createdby: 'SYSTEM', modifiedby: 'SYSTEM'});
                        usr.saveAsync()
                            .then(function (saveduser) {
                                console.log(JSON.stringify(saveduser));
                            })
                            .catch(function (err) {
                                console.log("There was an error");
                            })
                    }
                }).catch(function (cacth) {

                })

}