const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;


const app = express();

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: "authapp",
    resave: true,
    saveUninitialized: true
}));

//CORS 
app.use(cors());
//Middleware for body-pasrse
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

//set view dirct and engine
app.set("views", __dirname + "/views");
app.set("viewengine", "ejs");


passport.use(new Strategy({
    clientID: "clientID",
    clientSecret: "clientSecret",
    callbackUrl: "http://localhost:3000/login/facebook/return"
}, function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function (user, cb) {
    return cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
    return cb(null, obj)
})

//Routes
//@route  -  GET /
//@desc  -  a route to homepage
//@type  -  PUBLIC
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user
    })
});

//@route  -  GET / login
//@desc  -  a route to login
//@type  -  PUBLIC
app.get("/login", (req, res) => {
    res.render("login")
});

//@route  -  GET / login / facebook
//@desc  -  a route to login
//@type  -  PUBLIC
app.get("/login/facebook",
    passport.authenticate('facebook'));

//Failur Redirect
//@route  -  GET / login / facebook
//@desc  -  a route to login
//@type  -  PUBLIC
app.get("/login/facebook",
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        // Success auth, redirct home
        res.redirect('/')
    });

//@route  -  GET / profile
//@desc  -  a route to get profile of user
//@type  -  PRIVATE
app.get("/profile", require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('profile', {
        user: req.user
    })
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is listing on PORT ${PORT}`);
})