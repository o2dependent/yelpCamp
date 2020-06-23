const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = {};
// - MIDDLEWARE METHODS -
// CHECKS CAMPGROUND OWNERSHIP
middleware.checkCampgroundOwnerShip = (req, res, next) => {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) => {
			if(err || !foundCamp) {
				console.log(err);
				req.flash("error","Could not find campground");
				res.redirect("back");
			} else {
				if(foundCamp.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}
// CHECK IF USER IS LOGGED IN
middleware.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You have to be logged in to do that!");
	res.redirect("/login");
}
// AUTHORIZE USER MIDDLEWARE
middleware.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err || !foundComment) {
				req.flash("error", "Comment not found");
				console.log(err);
				res.redirect("/campgrounds");
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					return next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("/login");
	}
}


module.exports = middleware;