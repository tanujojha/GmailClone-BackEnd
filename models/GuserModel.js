import mongoose from "mongoose";

const GuserSchema = new mongoose.Schema({
    googleID: String,
    name: String,
    email: String,
    imgURL: String,
    accessToken: String,
    refreshToken: String
},{timestamps: true})

const GUser = mongoose.model("GUser", GuserSchema)

export default GUser;