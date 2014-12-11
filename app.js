// Normal Express requires...
console.log("start");
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var engine  = require( 'ejs-locals' );

console.log("require done");

////initializes the engine for ejs
app.engine( 'ejs', engine );
app.set( 'view engine', 'ejs' );


///For meeting db/////
var meetingRoutes = require('./routes/meetingRoutes.js');
var meeting = require('./models/meetingmongoose.js');
var config = require('./config'); //connects to my database

app.use(morgan('combined'));

app.put("/put/:meeting_name/:date/:time/:location/:description", meetingRoutes.putMeeting);

//renders the group page
// app.get("/get/page/:meeting_name",
//     function(req,res){
//         console.log("app.js=" + req.user);
//         return res.render('group');
//     });


app.get("/get/:meeting_name", meetingRoutes.getMeeting);


app.delete("/delete/:meeting_name", meetingRoutes.deleteMeeting);

console.log("routes done");

// app.get("/landing", meetingRoutes.getYourMeeting);



///connecting mongoose with mongodb
mongoose.connect(config.db, {auto_reconnect: true, native_parser: true}, function(err) {
    console.log("connected to mongo db");
});

//passport
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/signup.js')(app, passport); // load our routes and pass in our app and fully configured passport


// Set the views directory
app.set('views', __dirname + '/views');
// Define the view (templating) engine
app.set('view engine', 'ejs');
// Log requests
app.use(morgan('tiny'));


// This is where your normal app.get, app.put, etc middleware would go.

// Handle static files
app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res) {
	return res.render('login');
});


/*1*/ var httpServer = http.Server(app);
/*2*/ var sio =require('socket.io');
/*3*/ var io = sio(httpServer);


/*4*/ 	httpServer.listen(50000, function(){
			console.log('Listening on 50000');}
		);

/*
 * For this particular example, I have separated out the main logic for 
 * controlling the socket.io exchange to a route called serverSocket.js
 */

var gameSockets = require('./routes/serverSocket.js');
gameSockets.init(io);

//*********************************//Chat//*********************************//
var chat = require('./routes/chat.js');
chat.init(io);

//*********************************//Passport//*********************************//
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('./models/user.js');
// meeting.create({
//   meeting_name:  'blah'
// }, function(err, meeting){ console.log(meeting)}); //for testing


    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        firstnameField : 'firstname',
        lastnameField : 'lastname',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log(email);
        console.log(password);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        console.log("signing up ");

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            console.log(user);
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.firstname = req.body.lastname[0];
                newUser.local.lastname = req.body.lastname[1];

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

    }));
// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));




