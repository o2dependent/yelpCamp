const express = require("express"),
	  app = express(),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
	  methodOverride = require("method-override"),
	  seedDB = require("./seeds"),
	  flash = require("connect-flash");


//Required Routes
const commentRoutes = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://131eolsen:jF11FogPSswuKk6B@cluster0-fxhry.mongodb.net/Cluster0?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.set("view engine","ejs");

// seedDB(); //seed db

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Winner winner chicken dinner",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// - USE -
// Pass currentUser variable to all ejs templates
app.use((req,res,next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000, () => {
	console.log("Yelp Camp online");
});