import { asynchandler } from "../utils/asynchandler";
import {ApiError} from "../utils/apierrors"
import { Jwt } from "jsonwebtoken";
import { jwt } from "zod";
import { User } from "../models/user.model"
export const verifyJWT = asynchandler(async(req, res, next) => {  //next keyward is Imp because middle says go to next Middleware I am done
    const token = req.cookies?.accessToken  || req.header("authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "unauthorized request")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")

    if (!user) {
        throw new ApiError(401, "Invalid Access token")
    }

    req.user = user;
    next()
})