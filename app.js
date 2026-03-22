require('dotenv').config();

// Validate required environment variables
const requiredEnv = ['JWT_SECRET', 'BASIC_AUTH_USER', 'BASIC_AUTH_PASS'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { engine } = require("express-handlebars");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const indexRouter = require('./routes/index');
const apiRouter = require("./routes/api");
const dashboardRouter = require("./routes/dashboard");

const app = express();
app.disable('x-powered-by');

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

// ──── LAYER 1 — IP Filtering ────
const allowedIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
app.use((req, res, next) => {
  if (!allowedIPs.includes(req.ip)) {
    return res.status(403).render("error", {
      message: "403 — Your IP is not allowed.",
      title: "Error",
    });
  }
  next();
});

// ──── LAYER 2 — CORS ────
app.use(cors({
  origin: "http://localhost:3000",
}));

// ──── LAYER 3 — Rate Limiting ────
app.use(rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).render("ratelimit", { title: "Too Many Requests" });
  },
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/', dashboardRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
