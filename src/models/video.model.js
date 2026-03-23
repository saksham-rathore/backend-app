import mongoose, {Schema} from "mongoose";  

const VideoSchema = new Schema(
    {
    videofile: {
        type: String, //cloudinary URL
        required: true,
    },
    thumbnail: {
        type: String,  //cloudinary URL
        required: True,
    },
    title: {
        type: String, 
        required: True,
    },
    Description: {
        type: String, 
        required: True,
    },
    Duration: {
        type: Number, 
        required: True,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
)

export const Video = mongoose.model("Video", VideoSchema)