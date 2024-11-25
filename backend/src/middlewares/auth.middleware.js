import { User } from "../models/users.model.js";
import { Guest } from "../models/guests.model.js";
import { ApiError } from "../utils/ApiError.js";

// Todo: Separate User and Guest Verification Logic.
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            throw new ApiError(401, "Unauthorized request.");
        }

        const decodedToken = await jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
        
        if(!decodedToken){
            decodedToken = await jwt.verify(token, process.env.GUEST_ACCESS_TOKEN_SECRET);

            if(!decodedToken){
                throw new ApiError(401, "Unauthorized request.");
            }
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            user = await Guest.findById(decodedToken._id).select("-refreshToken");

            if(!user){
                throw new ApiError(401, "Invalid Access Token.");
            }
            else{
                req.isGuest = true;
            }
        }
        else{
            req.isGuest = false;
        }

        req.user = user;
        
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token.");
    }
}

export default verifyJWT;