var express = require("express");
var router = express.Router();
var Image = require("../models/image");
var middlewear = require("../middlewear");

//INDEX - show all images
router.get("/", function(req, res){
    // Get all images from DB
    Image.find({}, function(err, allImages){
       if(err){
           console.log(err);
       } else {
          res.render("images/index",{images: allImages, page: 'images'});
       }
    });
});

// Create route
router.post("/", middlewear.isLoggedIn,  function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newImage = {name: name, price: price, image: image, description : desc, author: author};
   Image.create(newImage, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log(newlyCreated);
           res.redirect("/images");
       }
   });
});


// New route
router.get("/new", middlewear.isLoggedIn,  function(req, res){
   res.render("images/new"); 
});

// Show route
router.get("/:id", function(req, res){
    Image.findById(req.params.id).populate("comments").exec(function(err, foundImage){
        if(err){
            console.log(err);
        } else {
            console.log(foundImage);
             res.render("images/show", {image: foundImage});
        }
    });
});

// EDIT image route
router.get("/:id/edit", middlewear.checkImageOwnership, function(req, res){
          Image.findById(req.params.id, function(err, foundImage){
               if(err){
            console.log(err);
        } else {
           res.render("images/edit", {image: foundImage});
        }
    });
});

// UPDATE image route
router.put("/:id", middlewear.checkImageOwnership, function(req, res){
   Image.findByIdAndUpdate(req.params.id, req.body.image, function(err, updatedImage){
       if(err){
           res.redirect("/images");
       } else {
           res.redirect("/images/" + req.params.id);
       }
   })
});


// DESTROY image route
router.delete("/:id", middlewear.checkImageOwnership, function(req, res){
   Image.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/images");
       } else {
           res.redirect("/images");
       }
   })
});




module.exports = router;