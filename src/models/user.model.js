import mongoose, {Schema, schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userschema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true, 
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true,
        },
        Fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,  //cloudinary URL
            required: true
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ], 
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshtoken: {
            type: String
        }
},{
    timestamps: true
})

userschema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userschema.methods.ispasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userschema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            Fullname: this.Fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken = function(){
        return jwt.sign(
        {
            email: this.email,
            password: this.password
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
  
export const user = mongoose.model("User", userschema);