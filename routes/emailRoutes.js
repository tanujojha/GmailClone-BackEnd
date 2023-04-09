import express from 'express';
import { authCheck } from '../middlewares/authCheck.js';
import transporter from '../config/transporterConfig.js';
import GUser from '../models/GuserModel.js';


const router = express.Router();


// POST EMAIL
router.post("/postemail", authCheck, async (req, res)=>{
    
    // message from req.body 
    const {to, subject, message, fromID} = req.body;

    // find logged in user from DB with incoming req from client using the fromID
    const userFrmDB = await GUser.findById(fromID);
    
    // console.log(userFrmDB);
    // console.log(req.body);

    const x = await transporter.sendMail({
        from: "00tanoj00@gmail.com",
        to: to,
        subject: subject,
        text: message,
        auth: {
          user: "00tanoj00@gmail.com",
          refreshToken: userFrmDB.refreshToken,
          accessToken: userFrmDB.accessToken
        },
    });

    console.log(x);
    
    // try {
    //     // console.log(newmsg);
    //     const result = await sendMail(newmsg)
    //     console.log(result);
    //     res.status(200).send("got email")
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send("some thing happende cant recieve email")
    // }
})


export default router


