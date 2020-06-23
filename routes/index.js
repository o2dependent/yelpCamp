const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
//Root Route
router.get("/", (req, res) => {
	res.render("landing");
});


// ===========
// AUTH ROUTES
// ===========
//Register form
router.get("/register", (req, res) => {
	res.render("register");
});
//Sign up logic
router.post("/register", (req,res) => {
	let newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to yelpCamp, " + user.username + "!");
			console.log("ACCOUT CREATED");
			res.redirect("/campgrounds");
		});
	});
});

//Login form
router.get("/login", (req, res) => {
	res.render("login");
});
//Login logic
router.post("/login",passport.authenticate("local", 
				{successRedirect: "/campgrounds", //Middleware
				 failureRedirect: "/login"
				 }), (req, res) => { 			  //Callback
});

//Logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have been successfully logged out!");
	res.redirect("/campgrounds");
});


module.exports = router;