var express = require("express");
var router = express.Router({mergeParams: true});
var Image = require("../models/image");
var Comment = require("../models/comment");
var middlewear = require("../middlewear");

// Comments New
router.get("/new", middlewear.isLoggedIn,  function(req, res){
    Image.findById(req.params.id, function(err, image){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {image: image});
        }
    });
});

// Comments Create
router.post("/", middlewear.isLoggedIn, function(req, res){
   Image.findById(req.params.id, function(err, image){
       if(err){
           console.log(err);
           res.redirect("/images");
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  req.flash("error", "Something went wrong");
                  console.log(err);
              } else {
                  // add username and if to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  // save comment
                  comment.save();
                  image.comments.push(comment);
                  image.save();
                  console.log(comment);
                  req.flash("success", "Successfully added comment");
                  res.redirect("/images/" + image._id);
              }
           });
       }
   }) ;
});

//Comment edit route
router.get("/:comment_id/edit", middlewear.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {image_id: req.params.id, comment: foundComment});

       }
    });
});

// Comment Update
router.put("/:comment_id", middlewear.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
            res.redirect("back");
       } else {
            res.redirect("/images/" +req.params.id);
       }
    });
});


//Comment destroy route
router.delete("/:comment_id", middlewear.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/images/" + req.params.id);
       }
   })
});





module.exports = router;