var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Image  = require("../models/image");


// Root route
router.get("/", function(req, res){
    res.render("landing"); 
});



/// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser =new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar,
            email: req.body.email
            });
    if(req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
   User.register(newUser, req.body.password, function(err, user){
      if(err){
    console.log(err);
    return res.render("register", {error: err.message});
        }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to myBlog " + user.username);
           res.redirect("/images");
       });
   });
});

// show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// handling login logic
router.post("/login", passport.authenticate("local",
{   
    successRedirect: "/images",
    failureRedirect: "/Login"
    
}), function(req, res){
});


// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/images");
});




// user profile
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Something Went Wrong");
          return res.redirect("/");
       }
       Image.find().where("author.id").equals(foundUser._id).exec(function(err, images){
           if(err){
           req.flash("error", "Something Went Wrong");
          return res.redirect("/");
       }
           res.render("users/show", {user: foundUser, images: images});
       });
   }) ;
});

module.exports = router;