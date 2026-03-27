import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierrors.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Api.response.js";


// creating method for generate Tokens
const generateAccessTokenandRefreshToken = async(userId) =>
{try {
  const user = await user.findById(userId)
  const accessToken = user.generateAccessToken()
  const Refreshtoken = user.generateRefreshToken()

  user.Refreshtoken = Refreshtoken
  await user.save({ validateBeforeSave: false })

  return {accessToken, Refreshtoken}

} catch (error) {
  throw new ApiError(500, "something went wrong while generating refresh and Access token")
}
}

const registerUser = asynchandler(async (req, res) => {
  const { Fullname, email, username, password } = req.body;

  if (
    [Fullname, email, username, password].some(
      (field) => typeof field !== "string" || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    const duplicatedField = existedUser.username === username.toLowerCase() ? "username" : "email";
    throw new ApiError(409, `User with this ${duplicatedField} already exists`);
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

  const User = await user.create({
    Fullname,
    avatar: avatar.url,
    email,
    password,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const createdUser = await user
    .findById(User._id)
    .select("-password -refreshtoken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  const {email, username, password} = req.body

  if (!email || !username) {
    throw new ApiError(400, "username or password required")
  }

  const User = await user.findOne({
    $or: [{username}, {email}]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const passwordvalid = await user.isPasswordCorrect(password) 

  if ( !passwordvalid ) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const {Refreshtoken,accessToken} =await generateAccessTokenandRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", Refreshtoken, options).json(new ApiResponse(
    200, {
      user: loggedInUser, accessToken, Refreshtoken
    },
    "User logged In Successfully"
  ))
})

const logoutUser = asynchandler(async(req, res) => {
  
})

export { registerUser, loginUser };