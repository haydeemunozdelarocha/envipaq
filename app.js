var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var db = require('./db.js');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
var usuarios = require('./routes/usuarios');
var planes = require('./routes/api/planes');


var passport = require('passport');
    passport.serializeUser(function(user, done) {
        done(null, user.usuario_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM usuarios WHERE usuario_id ="+id, function(err, rows){
          if(rows){

            done(err, rows[0]);
          }
        });
    });
passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM usuarios WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, console.log('That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                    console.log(newUserMysql)
                    var insertQuery = "INSERT INTO usuarios(username, password) values (?,?)";

                    db.query(insertQuery, [newUserMysql.username, newUserMysql.password], function(err, rows) {
                      console.log(insertQuery)
                      console.log(newUserMysql.username, newUserMysql.password)
                      console.log(rows);
                        newUserMysql.usuario_id= rows.insertId;
                        console.log(newUserMysql.usuario_id)
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM usuarios WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, console.log('No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, console.log('Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

var options = {
    cookie : { httpOnly: true, maxAge: 3600000*24 },
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options, db);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'session_cookie_name',
  secret: 'foobar',
  resave: true,
  saveUninitialized: false,
  cookie:{maxAge:new Date(Date.now() + (3600000*24))},
  store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/usuarios', usuarios);
app.use('/api/planes', planes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
