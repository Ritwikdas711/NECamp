var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var flash=require("connect-flash")
var passport=require("passport");
var localStrategy=require("passport-local");
app.use(bodyParser.urlencoded({extended: true}));
Campground= require("./models/campgrounds");
Comment=require("./models/comment");
User=require("./models/user")
seedDB=require("./seeds");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

/* mongoose.connect('mongodb://localhost:27017/ne_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); */

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Ritwik:Webdevbootcamp@necamp.yinx9.mongodb.net/necamp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//seedDB();
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));	//to let express serve the public directory
app.set("view engine","ejs");       //to not explicitly define .ejs extension everytime in render()

app.use(require("express-session")({
secret: "Hope I get a placement",
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000 , process.env.IP,function(){
	console.log("Starting Server");
});
