const mongoose = require("mongoose");
const Comment = require("./comment");

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String,
	price: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
// COMMENT SELF DESTRUCT
campgroundSchema.pre("remove", async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});


module.exports = mongoose.model("Campground", campgroundSchema);