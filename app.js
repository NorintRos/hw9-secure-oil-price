var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require("express-handlebars");

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.engine("hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    formatPrice: (val) => val.toFixed(2),
    isPositive: (val) => val >= 0,
  },
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ──── LAYER 1 — IP Filtering ────
const allowedIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
app.use((req, res, next) => {
  if (!allowedIPs.includes(req.ip)) {
    return res.status(403).render("error", {
      message: "403 — Your IP is not allowed.",
    });
  }
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
