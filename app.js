require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');

var flash = require('express-flash');

var app = express();
mongoose.set('useUnifiedTopology', true)
mongoose.connect('mongodb://localhost/users' , { useNewUrlParser: true, useCreateIndex: true} )

// Middleware
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/forgot'));
app.use(require('./routes/reset'));
app.use(require('./routes/login'));

const db = mongoose.connection
db.on('error', (error)=> console.error(error))
db.once('open', ()=> console.log('Connected to Database'))


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});