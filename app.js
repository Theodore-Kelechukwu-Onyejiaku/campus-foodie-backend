var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config()


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require("./routes/admin");
var orderRouter = require("./routes/order");
var dishRouter = require("./routes/dish");
var authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit:"50mb", extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use("/api/auth", authRouter);
app.use('/api/user', userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/order", orderRouter);
app.use("/api/dish", dishRouter);

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

//Mongodb connection
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on("error", ()=>{
  console.error.bind(console, 'MongoDB connection error:')
})

db.on("open", ()=>{
  console.log("database running successfully");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log("App running on port: "+PORT);
})