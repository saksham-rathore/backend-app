import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Api.response.js";
import { Jwt } from "jsonwebtoken";

// creating method for generate Tokens
const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const Refreshtoken = user.generateRefreshToken();

    user.refreshtoken = Refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and Access token",
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { Fullname, email, username, password } = req.body;

  if (
    [Fullname, email, username, password].some(
      (field) => typeof field !== "string" || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    const duplicatedField =
      existedUser.username === username.toLowerCase() ? "username" : "email";
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

  const newUser = await User.create({
    Fullname,
    avatar: avatar.url,
    email,
    password,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshtoken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asynchandler(async (req, res) => {
  const { email, username, password } = req.body;

  //loginUser controller mein ek validation check kar rahi hain.
  if (!email && !username) {
    throw new ApiError(400, "username or password required");
  }

  //Ye lines Database mein User ko dhundne (find karne) ka kaam kar rahi hain.
  const userInstance = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!userInstance) {
    throw new ApiError(404, "User does not exist");
  }

  const passwordvalid = await userInstance.ispasswordCorrect(password);

  if (!passwordvalid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //Ye lines user ko successfully Login karwane, Access aur Refresh Tokens generate/banane aur unko browser ke Cookies mein safely send karne ka saara kaam handle kar rahi hain.
  const { Refreshtoken, accessToken } =
    await generateAccessTokenandRefreshToken(userInstance._id);

  const loggedInUser = await User.findById(userInstance._id).select(
    "-password -refreshtoken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", Refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          Refreshtoken,
        },
        "User logged In Successfully",
      ),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

//creating refresh token end-point
const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await user.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenandRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access Token Refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
