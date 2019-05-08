var middlewearObj = {};
var Image = require("../models/image");
var Comment = require("../models/comment");

middlewearObj.checkImageOwnership = function(req, res, next){
    if(req.isAuthenticated()){
          Image.findById(req.params.id, function(err, foundImage){
       if(err){
           req.flash("error", "Image not found");
           res.redirect("back");
       } else {
           if(foundImage.author.id.equals(req.user._id) || req.user.isAdmin){
          next();
       } else {
           req.flash("error", "You don't have permission to do that");
           res.redirect("back");
       }
       }
    });
    } else {
         req.flash("error", "You nedd to be logged in to do that");
        res.redirect("back");
    }
};


middlewearObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
          Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
          next();
       } else {
           req.flash("error", "You don't have permission to do that");
           res.redirect("back");
       }
       }
    });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewearObj.isLoggedIn = function(req,res, next){
    if(req.isAuthenticated()){
    return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewearObj;