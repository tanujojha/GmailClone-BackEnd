import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import connectDB from "./db.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import userSigningRoutes from "./routes/userSigningRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";



connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

//CORS option
const corsOptions = {
  origin: true, //included origin as true for same origin
  credentials: true, //included credentials as true for cookies
};

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: process.env.JWTSECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(passportConfig)

//ROUTES
app.use("/auth", googleAuthRoutes, userSigningRoutes);  // /auth uses both googleAuth routes and normal auth routes
app.use("/email", emailRoutes);

//test vercel
// app.get("/", async(req, res)=>{
//   res.send("Hello")
// })


app.listen(PORT, () => {
  console.log("Server started on 5000");
});
