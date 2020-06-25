let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment   = require("./models/comment");
let User = require("./models/user");
 

 
function seedDB(){
	Campground.deleteMany({}, (err) => {
		if(err) {
			console.log(err);
		}
	});
	Comment.deleteMany({}, (err) => {
		if(err) {
			console.log(err);
		}
	});
	User.deleteMany({}, (err) => {
		if(err) {
			console.log(err);
		}
	});
}
 
module.exports = seedDB;