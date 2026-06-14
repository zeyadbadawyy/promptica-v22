var createError = require('http-errors');

require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var promptRouter = require('./routes/prompt');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/prompt', promptRouter);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.json({ message: "Promptica API is running" });
});



//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});



module.exports = app;
