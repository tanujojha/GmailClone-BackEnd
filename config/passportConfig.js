import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import GUser from "../models/GuserModel.js";

const GoogleStrategy = passportGoogle.Strategy;


passport.use(
  new GoogleStrategy( 
    {
      clientID: process.env.CLIENTID,  
      clientSecret: process.env.CLIENTSECRETE,
      callbackURL: process.env.CALLBACKURL, 
    },
    async (accessToken, refreshToken, profile, cb)=> {

      const currentUser = await GUser.findOne({googleID: profile.id})
      if(!currentUser){
        const newUser = await new GUser({
            googleID: profile.id,
            name: profile._json.name,
            email: profile._json.email,
            imgURL: profile._json.picture,
            accessToken: accessToken,
            refreshToken: refreshToken
        }).save ();
        if(newUser){
            cb(null, newUser)
        } 
      }else{
        cb(null, currentUser)
      }
    }
  )
);


// serializing user
passport.serializeUser(function (user, cb) {
    
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

// Dserilising user
passport.deserializeUser(function (user, cb) {
  
  process.nextTick(function () {
    return cb(null, user);
  });
});


export default  passport