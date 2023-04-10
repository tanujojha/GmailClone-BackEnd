import express from "express";
import passport from "passport";
import passportConfig from "../config/passportConfig.js"  //importing passport config
import GUser from "../models/GuserModel.js";

const router = express.Router();


// auth with google
router.get("/google",
  passport.authenticate("google", {  
    scope: ["profile", "email"],
    accessType: "offline",
    // prompt: "consent",
  })
);

// redirect to client's root("/") page after success login via google
router.get("/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/Glogin/failed",
    successRedirect: `${process.env.CLIENTURL}`
  })
 
);


// when login is successful, retrieve user info
router.get("/Glogin/success", async (req, res) => {
  if (req.user) {
    // console.log(req.user);
    const userFrmDB = await GUser.findById(req.user.id, 'googleID name  email imgURL')
    
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
      userFrmDB: userFrmDB
    });
  }else{
    res.status(401).send({success: false, message: "Not Authorized"})
  }
}); 


// when login failed, send failed msg
router.get("/Glogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate." 
  });
});

// When logout, send logut msg
router.get("/Glogout", (req, res) => {
  req.logout((err)=> {
    if (err) { 
      return next(err); 
    }else{
      console.log("logged out");
      res.status(200).send({success: true, message: "Logged out"})
    }
  });

});

export default router;
