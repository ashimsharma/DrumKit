import { User } from "../models/users.model.js";
import { Guest } from "../models/guests.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Todo: Separate User and Guest Verification Logic.
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer ", "");

        if (!token) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Token not provided."
                    }
                )
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
        } catch (error) {
            decodedToken = undefined;
        }

        if (!decodedToken) {
            try {
                decodedToken = jwt.verify(token, process.env.GUEST_ACCESS_TOKEN_SECRET);
            } catch (error) {
                decodedToken = undefined;
            }

            if(!decodedToken){
                return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Unauthorized request."
                    }
                )
            }
        }

        let user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            user = await Guest.findById(decodedToken._id).select("-refreshToken");

            if (!user) {
                return res
                .status(401)
                .json(
                    {
                        statusCode: 404,
                        success: false,
                        message: "User not found."
                    }
                )
            }
            else {
                req.isGuest = true;
            }
        }
        else {
            req.isGuest = false;
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(400, error?.message);
    }
}

export default verifyJWT;