import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asynchandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(409, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase()
  })
});

export { registerUser };
