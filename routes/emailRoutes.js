import express from 'express';
import { authCheck } from '../middlewares/authCheck.js';
import transporter from '../config/transporterConfig.js';
import GUser from '../models/GuserModel.js';

const router = express.Router(); 


// POST EMAIL
router.post("/postemail", authCheck, async (req, res)=>{
  const {to, subject, message, fromID} = req.body;

  try {
    const userFrmDB = await GUser.findById(fromID);
    
    const info = await transporter.sendMail({
      from: userFrmDB.email,
      to: to,
      subject: subject,
      text: message,
      auth: {
        user: process.env.EMAIL,
        refreshToken: process.env.REFRESHTOKEN,
        
      },
    });

    if(info.messageId){
      res.status(200).send({message: "Email sent Succesfully"})
    }else{
      res.status(500).send({message: "Cant send Email, Check your composition"})
    }

  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error")
  }
    
    
    
   

        
})


export default router

