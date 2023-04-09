import mongoose from "mongoose";

const mongoURL = "mongodb://localhost:27017/gmailCloneDB";

async function dbConnection() {
  try {
    let x = await mongoose.connect(mongoURL);
    x ? console.log("MongoDB connected ✔") : console.log("MongoDB ❌NOT❌ connected");
  } catch (error) {
    console.log(error);
  }
}

export default dbConnection;
