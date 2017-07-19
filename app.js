'use strict'
/**
* @name app
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
*@copyright KP Singh Chundawat
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
require('./helper/mongoose.js')();
var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Promisify all required modules
require('./promise-me');

//configuring all routes
require('./routes/index').configure(app);
require('./oauth').configure(app).registerErrorHandler();
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(6001, function () {
  console.log("App Listening  on ", 6001);
});
module.exports = app;
