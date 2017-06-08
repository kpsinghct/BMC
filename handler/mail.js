var nodemailer = require('nodemailer');
var mailconfig = require('../config/mailconfig.js');

module.exports.sendmail = function (to, sub, message, ishtml) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailconfig.username,
            pass: mailconfig.password
        }
    });

    var mailOptions = {
        from: mailconfig.username,
        to: to,
        subject: sub
    };
    if (ishtml)
        mailOptions.html = message;
    else
        mailOptions.text = message;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

