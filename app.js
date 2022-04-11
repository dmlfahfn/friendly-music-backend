var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Enables CORS
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const MongoClient = require("mongodb").MongoClient

MongoClient.connect("mongodb://127.0.0.1:27017", {
  useUnifiedTopology: true
})
.then(client => {
  console.log("Vi är uppkopplade mot databsen!");

  const db = client.db("music");
  app.locals.db = db;
})
  
app.use(cors({ origin: true }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
