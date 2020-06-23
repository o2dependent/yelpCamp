const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
// =================
// CAMPGROUND ROUTES
// =================

// INDEX
router.get("/", (req, res) => {
	//Get all campgrounds
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log("ERROR: " + err);
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
});
// NEW - Show form to create new campground
router.get("/new",middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});
// CREATE
router.post("/",middleware.isLoggedIn, (req, res) => {
	//get data from form and add to campgrounds array
							// let name = req.body.name;
							// let img = req.body.img;
							// let desc = req.body.description;
							// let author = {
							// 	id: req.user._id,
							// 	username: req.user.username
							// };
							// let newCamp = {
							// 	name: name,
							// 	img: img,
							// 	description: desc,
							// 	author: author
							// }
	req.body.camp.author = {
		id: req.user._id,
		username: req.user.username
	}
	//Add campground to db
	Campground.create(req.body.camp, (err) => {
		if(err) {
			req.flash("error", err.message);
			console.log("ERROR: " + err);
		} else {
			req.flash("success", "Campground successfully created");
			//redirect to campgrounds page
			res.redirect("campgrounds");
		}
	});
	
});
// SHOW
router.get("/:id", (req, res) => {
	//Get the id from the db
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp) => {
		if(err || !foundCamp) {
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//Render the page with id data
			res.render("campgrounds/show", {camp: foundCamp});
		}
	});
});
// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		res.render("campgrounds/edit",{camp: foundCamp});
	});
});
// UPDATE
router.put("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err,foundCamp) => {
		if(err) {
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground successfully updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnerShip, async(req, res) => {
	try {
		let foundCamp = await Campground.findById(req.params.id);
		await foundCamp.remove();
		req.flash("success", "Campground has been successfully removed");
		res.redirect("/campgrounds");
	} catch(err) {
		req.flash("error", err.message);
		console.log(err.message);
		res.redirect("/campgrounds");
	}
});


module.exports = router;