const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
// ==============
// COMMENT ROUTES
// ==============
// - NEW -
router.get("/new",middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err || !foundCamp) {
			req.flash("error", "Could not find campground");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("comments/new",{camp: foundCamp});
		}
	});
});
// - CREATE -
router.post("/",middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCamp) => {
		if(err || !foundCamp) {
			req.flash("error", "Could not find campground");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err || !comment) {
					req.flash("error", "Something went wrong");
					console.log(err);
					res.redirect("back");
				} else {
					//add usename and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success", "Comment successfully created!");
					res.redirect("/campgrounds/" + foundCamp._id);
				}
			});
		}
	});
});
// - EDIT ROUTES -
// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err || !foundComment) {
			req.flash("error", "Could not find comment");
			console.log(err);
			res.redirect("back");
		} else {
			Campground.findById(req.params.id, (err, foundCamp) => {
				if(err || !foundCamp) {
					req.flash("error", "Could not find campground");
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					res.render("comments/edit", {camp: foundCamp,comment: foundComment});
				}
			});
		}
	});
});
// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
		if(err || !foundComment) {
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Comment updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});



// - DESTROY -
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Comment has been removed");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




module.exports = router;