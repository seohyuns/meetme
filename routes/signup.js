// app/routes.js
var meetingModel = require ('../models/meetingmongoose.js');

module.exports = function(app, passport) {



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('landing.html'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    // =====================================
    // GROUPChAT SECTION =====================
    // =====================================
    //renders the group page
    app.get("/get/page/:meeting_name", function(req,res){
            var temp= req.user;
            console.log("app.js=" + temp);
            return res.render('group', {user:temp
            });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/landing', function(req, res) {
        var temp = req.user;
        console.log("signup.js=" + temp);
        meetingModel.getYourMeetings(temp,function(meetings){
            console.log("getyourmeetings was hit in signup.js");
            console.log(meetings);
            res.render('landing', {m: meetings, user:temp})
        });
    });

    // =====================================
    // ADDING NEW ==========================
    // =====================================
    app.post("/post/:meeting_name/:date/:time/:location/:description", function(req, res){
        meetingRoutes.addMeeting(req, function(meeting){
            console.log(req);
            console.log("successfully posted");
        }); 
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/landing', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        successFlash: 'Yay',
        failureFlash : 'Fail' // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/landing', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })
    );

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
