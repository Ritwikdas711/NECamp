var express=require("express");
var router=express.Router(); 
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

router.get("/",function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
        res.render("index",{campgrounds:allCampgrounds,currentUser: req.user});
        }
});
});

router.post("/",middleware.isLoggedin,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var state=req.body.state;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }

    var newCamp = {name: name,state:state, image: image, description: desc,author:author}
    
    //adding to DB
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds"); //redirect default goes to the get if two similar routes present
        }
        
    });
});

router.get("/new",middleware.isLoggedin,function(req,res){
    
    res.render("new");  
})
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
        })
    
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campedit",{campground: foundCampground});
    })
    
})
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            res.redirect("/camgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})



module.exports=router;