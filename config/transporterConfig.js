import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";


let transporter = await nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRETE,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
    console.log("transporter error");
  } else {
    // console.log(success);
    console.log(`${success} + SMTP Server is ready`);
  }
});

export default transporter
