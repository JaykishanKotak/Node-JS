const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const {
    removeListener
} = require("../../models/Person.js");

//Load Person Modal
const Person = require("../../models/Person.js");

//Load Profile Modal
const Profile = require("../../models/Profile.js");

//@type GET
//@route /api/profile
//@desc route for user profile
//@access PRIVATE
//router.get('/', (req, res) => {
//res.json({
//profile: "profile is success"
//})
//})
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        //Find User based on Id
        Profile.findOne({
                user: req.user.id,
            })
            .then((profile) => {
                //If no profile found
                if (!profile) {
                    return res.status(404).json({
                        profilenotfound: "No Profile Found",
                    });
                }
                return res.json(profile);
            })
            .catch((err) => console.log("Got a error in profile" + err));
    }
);

//@type POST
//@route /api/profile/
//@desc route for save personal user profile
//@access PRIVATE
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false,
    }),
    (req, res) => {
        //Empty Object to store values
        const profileValues = {};
        profileValues.user = req.user.id;

        if (req.body.username) profileValues.username = req.body.username;
        if (req.body.website) profileValues.website = req.body.website;
        if (req.body.country) profileValues.country = req.body.country;
        if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
        //FOR Languages -> turns into comma saprated values
        if (typeof req.body.languages !== undefined) {
            profileValues.languages = req.body.languages.split(",");
        }

        //Get Social Values
        profileValues.social = {};
        if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
        if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
        if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
        if (req.body.twitter) profileValues.social.twitter = req.body.twitter;
        if (req.body.whatsapp) profileValues.social.whatsapp = req.body.whatsapp;

        //Store Profile Values into DBase
        Profile.findOne({
                user: req.user.id,
            })
            .then((profile) => {
                if (profile) {
                    //Find and Update Uniqure user
                    Profile.findOneAndUpdate({
                            user: req.user.id,
                        }, {
                            $set: profileValues,
                        }, {
                            new: true,
                        })
                        .then((profile) => res.json(profile))
                        .catch((err) => console.log("problem in update" + err));
                } else {
                    Profile.findOne({
                            username: profileValues.username
                        })
                        .then(profile => {
                            //Username already exists
                            if (profile) {
                                res.status(400).json({
                                    username: "Username already exists"
                                });
                            }
                            // Save New User
                            new Profile(profileValues)
                                .save()
                                .then(profile => res.json(profile)) //Throw Entire Profile
                                .catch(err => console.log("Error in saving user " + err))
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log("Problem in fetching profile" + err));
    });

// @type    GET
//@route    /api/profile/:username
// @desc    route for getting user profile based on USERNAME
// @access  PUBLIC
router.get("/:username", (req, res) => {
    Profile.findOne({
            //Params comes from url
            username: req.params.username
        })
        //Import data from Person Db and chian with Profile
        .populate("user", ["name", "profilepic"])
        .then(profile => {
            if (!profile) {
                res.status(404).json({
                    usernotfound: "User not found"
                });
            } else {
                res.json(profile);
            }
        })
        .catch(err => console.log("Errer in fetching  username" + err));
})

// @type    GET
//@route    /api/profile/:id
// @desc    route for getting user profile based on ID
// @access  PUBLIC
/*router.get("/:id", (req, res) => {
    Profile.findOne({
            //Params comes from url
            _id: req.params.id
        })
        //Import data from Person Db and chian with Profile
        .populate("user", ["name", "profilepic"])
        .then(profile => {
            if (!profile) {
                res.status(404).json({
                    idnotfound: "ID not found"
                });
            } else {
                res.json(profile);
            }
        })
        .catch(err => console.log("Errer in fetching  ID" + err));
})*/

// Find Everyone from Database
// @type    GET
//@route    /api/profile/find/all
// @desc    route for getting user profile of All users
// @access  PUBLIC
router.get("/find/all", (req, res) => {
    // Find used to find every profile
    Profile.find()
        //Import data from Person Db and chian with Profile
        .populate("user", ["name", "profilepic"])
        .then(profiles => {
            if (!profiles) {
                res.status(404).json({
                    usernotfound: "NO profile was found"
                });
            } else {
                res.json(profiles);
            }
        })
        .catch(err => console.log("Errer in fetching  Profiles" + err));
})

//Delete perticuler Username from DB Using ID
// @type    DELETE
//@route    /api/profile/
// @desc    route for deleting user based on ID
// @access  PRIVATE
router.delete("/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        })
        //If you want to prompt message to user before deleting profile
        //.then(profile => {
        //if (!profile) {
        //res.status(404).json({
        //usernotfound: "User not found"
        ///});
        //} else {
        //res.send("Do you really want to delete this profiel ?");
        //}
        //})
        //.catch(err => console.log("Errer in fetching  Profiles before deleting" + err))
        Profile.findOneAndRemove({
                user: req.user.id
            })
            .then(() => {
                //Remove From Auth Section
                Person.findOneAndRemove({
                        _id: req.user.id
                    })
                    .then(() => res.json({
                        success: "delete was a success"
                    }))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log("Error During Delete Profile " + err))
    })

//Workprofile
// @type    POST
//@route    /api/profile/workrole
// @desc    route for adding work profile of a person
// @access  PRIVATE
//Can add multer code here to catch profile photos
router.post(
    "/workrole",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                // If profile is not found
                if (!profile) {
                    res.status(404).json({
                        usernotfound: "NO profile was found"
                    });
                } else {
                    const newWork = {
                        role: req.body.role,
                        position: req.body.position,
                        company: req.body.company,
                        country: req.body.country,
                        from: req.body.from,
                        to: req.body.to,
                        current: req.body.current,
                        details: req.body.details
                    };
                    //Shifting For Array with shift/unshift
                    profile.workrole.unshift(newWork);
                    profile
                        .save()
                        .then(profile => res.json(profile))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log("Error in workrole " + err));
    }
);

// @type    DELETE
//@route    /api/profile/workrole/:w_id
// @desc    route for deleting a specific workrole
// @access  PRIVATE
router.delete("/workrole/:w_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                if (!profile) {
                    res.status(404).json({
                        usernotfound: "NO profile was found"
                    });
                } else {
                    // Map all workrole ids in object
                    removethisid = profile.workrole.map(item => item.id)
                        .indexOf(req.params.w_id) //Got index of id which need to delete

                    profile.workrole.splice(removethisid, 1)
                    profile
                        .save()
                        .then(profile => res.json(profile))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log("Error in deleting work by id" + err));
    }
)
module.exports = router;