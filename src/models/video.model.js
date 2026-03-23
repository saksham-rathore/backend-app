import mongoose, {Schema} from "mongoose";  

const VideoSchema = new Schema(
    {
    videofile: {
        type: String, //cloudinary URL
    }
},
{
    timestamps: true
}
)

export const Video = mongoose.model("Video", VideoSchema)