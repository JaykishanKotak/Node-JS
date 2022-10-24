const express = require("express");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const router = express.Router();
const passport = require("passport")
const Person = require("../../models/Person.js");
const key = require("../../setup/myuri.js")
//@type GET
//@route /api/auth
//@desc for testing
//@access PUBLIC
//@http://localhost:3000/api/auth
router.get("/", (req, res) => {
    res.json({
        test: "auth is working"
    })
})

//Import Schema for Person Registor
//@type POST
//@route /api/auth/register
//@desc route for user registration
//@access PUBLIC
router.post("/register", (req, res) => {
    //DB Query for serach user by its email
    Person.findOne({
            email: req.body.email
        })
        .then(person => {
            //If User is registered
            if (person) {
                return res
                    .status(400)
                    .json({
                        emailerror: "Email is already registered in our system"
                    });
            } else {
                //Create New User
                const newPerson = new Person({
                    //Ref Person Schema for it
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //Passowrd Encryption using BCRYPT
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) throw err;
                        newPerson.password = hash;
                        newPerson
                            .save()
                            .then(person => res.json(person))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => console.log(err));
});

//Login Route
//@type POST
//@route /api/auth/login
//@desc route for login for users
//@access PUBLIC
router.post("/login", (req, res) => {
    //Grab Email and Password
    const email = req.body.email;
    const password = req.body.password;
    //Find Person from DB
    Person.findOne({
            email
        })
        .then(person => {
            //If user is not found
            if (!person) {
                return res.status(404).json({
                    emailerror: "This email is not registerd with system"
                })
            }
            //If user is found
            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        //res.json({
                        //success: "User succesfully logdin into system"
                        //})
                        const payload = {
                            id: person.id,
                            name: person.name,
                            email: person.email
                        };
                        Jwt.sign(
                            payload,
                            key.secret, {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                if (err) throw err;
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            }
                        )
                    } else {
                        res.status(400).json({
                            passworderror: "Password is not matching "
                        });
                    }
                }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));

})

//Redirect User to profile after auth
// @type    GET
//@route    /api/auth/profile
// @desc    route for user profile
// @access  PRIVATE
//Passport makes its private profile
router.get("/profile", passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        //console.log(req); Don't write it
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profilepic: req.user.profilepic
        })
    }
)
module.exports = router;