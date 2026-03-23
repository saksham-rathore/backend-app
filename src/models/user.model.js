import mongoose, {Schema, schema} from "mongoose";


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
                types: Schema.Types.ObjectId,
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
  
export const user = mongoose.model("User", userschema);