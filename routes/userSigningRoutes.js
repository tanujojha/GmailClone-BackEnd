import express from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import userVerify from '../middlewares/userVerify.js';

const router = express.Router();

//generate hashed password
const genHashPass = async (password)=>{
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); //Salting process
    const hashedpassword = await bcrypt.hash(password, salt); //Hashing process
    return hashedpassword;
}

// REGISTER
router.post("/register", async(req, res)=>{
    // console.log(req.body);
    const {name, email, password} = req.body;
    const hashedpassword = await genHashPass(password);
    
    try {

        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(400).send("Email already Registered")
        }else{
            const newUser = new User({
                name,
                email,
                password: hashedpassword
            });
            const user = await newUser.save();
    
            if(user){
                console.log("Registration Successfull");
                res.status(200).send("Registration Successfull")
            }else{
                res.status(500).send("Registration Failed")
            }

        }

        
    } catch (error) {
        console.log(error);
    }
})



// LOGIN
router.post("/login", async(req, res)=>{
    // console.log(req.body);
    const {email, password} = req.body;
    
    try {
        // find user with email from DB
        const user = await User.findOne({email: email});
        // this is to send the user detail to client
        const userToSendToClient = await User.findOne({email: email}, 'name email');
        if(!user){
            res.status(400).send("Email does not exits")
        }else{
            // validate password from DB
            const validatePassword = await bcrypt.compare(password, user.password);
            if(!validatePassword){
                res.status(400).send("wrong password");
            }else{
                // payload for jwt
                const payload = {
                    id: user.id,
                    email: user.email
                }
        
                //sign jwt
                const token = jwt.sign(payload, process.env.JWTSECRET);
                console.log("Login Successfull");
                res.status(200).send({message: "Success", token, user: userToSendToClient})
    
            }

        }


 
    } catch (error) {
        console.log(error);
    }
})


// GET USER FROM MIDDLEWARE userVerify
router.get("/fetchuser", userVerify, async(req, res)=>{
    // console.log(req.user);
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select({password:0});
        res.status(200).send(user)
        
    } catch (error) {
        console.log(error);
        res.status(400).send("something went wrong")
    }
})


export default router

//POINT TO NOTE IN THIS CODE
// CHECK DIFFERENCE BETWEEN ABOVE LOGIN CODE AND THIS CODE
// This is commented out because it shows error in console as we are sending multiple responses
// The error was >> Cannot set headers after they are sent to the client
// Here else is not used so if any error occours(eg: no email or pass found/match) its sent to client but at last one more response is sent
// so it results out in multiple responses and logs the above error
// This above error only occours when user enters wrong email or pass
// // LOGIN 
// router.post("/login", async(req, res)=>{
//     // console.log(req.body);
//     const {email, password} = req.body;
    
//     try {
//         // find user with email from DB
//         const user = await User.findOne({email: email});
//         if(!user){
//             res.status(400).send("Email does not exits")
//         }

//         // validate password from DB
//         const validatePassword = await bcrypt.compare(password, user.password);
//         if(!validatePassword){
//             res.status(400).send("wrong password");
//         };

//         // payload for jwt
//         const payload = {
//             id: user.id,
//             email: user.email
//         }

//         //sign jwt
//         const token = jwt.sign(payload, process.env.JWTSECRET);
//         console.log("Login Successfull");
//         res.status(200).send({message: "Success", token})
 
//     } catch (error) {
//         console.log(error);
//     }
// })