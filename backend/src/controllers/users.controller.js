import { Guest } from "../models/guests.model.js";
import { Recording } from "../models/recordings.model.js";
import { User } from "../models/users.model.js";
import sendVerificationEmail from "../services/nodemailer.js";
import { ApiError } from "../utils/ApiError.js";
import generateOTP from "../utils/OTPGenrator.js";
import { validateEmail, validateName, validatePassword } from "../utils/Validation.js";
import jwt, { decode } from "jsonwebtoken";
import generateVerificationToken from "../utils/VerificationToken.js";

const isAuthenticated = (req, res) => {
    const user = req?.user;

    if (!user) {
        return res
            .status(401)
            .json(
                {
                    success: false,
                    statusCode: 401,
                    message: "Unauthorized Request."
                }
            )
    }

    return res
        .status(200)
        .json(
            {
                success: true,
                statusCode: 200,
                message: "Authorized User.",
                data: { isGuest: req?.isGuest }
            }
        )
}

const generateUserAccessAndRefreshTokens = async (id) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(401, "User not found.");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Access and Refresh Token Generation Failed.");
    }
}

const generateGuestAccessAndRefreshTokens = async (id) => {
    try {
        const guest = await Guest.findById(id);

        if (!guest) {
            throw new ApiError(401, "Guest user not found.");
        }

        const accessToken = await guest.generateAccessToken();
        const refreshToken = await guest.generateRefreshToken();

        guest.refreshToken = refreshToken;
        await guest.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, firstname, lastname, password } = req?.body;

        if (
            [firstname, lastname, email].some((field) => field?.trim() === "")
        ) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "All fields are required."
                    }
                )
        }

        if (!(validateEmail(email) && validateName(firstname) && validateName(lastname) && validatePassword(password))) {
            return res
                .status(400)
                .json(
                    {
                        statusCode: 400,
                        success: false,
                        message: "Invalid Credentials."
                    }
                )
        }

        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res
                .status(409)
                .json(
                    {
                        statusCode: 409,
                        success: false,
                        message: "User with email already exists."
                    }
                )
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({ firstname, lastname, email, password, otp, otpExpires });

        sendVerificationEmail(email, otp);

        const verificationToken = generateVerificationToken(user._id, email);

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken -updatedAt -recordings"
        )

        if (!createdUser) {
            return res
                .status(501)
                .json(
                    {
                        statusCode: 501,
                        success: false,
                        message: "Something went wrong while saving the user."
                    }
                )
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res.status(200)
            .cookie("verificationToken", verificationToken, options)
            .json(
                {
                    statusCode: 200,
                    data: { user: createdUser },
                    message: "User Registered Successfully",
                    success: true
                }
            );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.cookies?.verificationToken || req.headers["Verification"]?.replace("Bearer ", "");
        const { otp } = req?.body;

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

        const decodedToken = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

        if (!decodedToken) {
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

        let user = await User.findById(decodedToken._id).select("-password -refreshToken -recordings");

        if (!user) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid Token."
                    }
                )
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res
                .status(403)
                .json({
                    statusCode: 403,
                    success: false,
                    message: "Invalid or Expired OTP."
                }
                )
        }

        await User.findByIdAndUpdate(decodedToken._id, {$set: {isVerified: true, otp: null, otpExpires: null}});

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res
        .status(200)
        .clearCookie("verificationToken", options)
        .json(
            {
                statusCode: 200,
                success: true,
                message: "Email Veified."
            }
        )
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const resendOTP = async (req, res) => {
    try {
        const token = req.cookies?.verificationToken || req.headers["Verification"]?.replace("Bearer ", "");

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

        const decodedToken = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

        if (!decodedToken) {
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

        let user = await User.findById(decodedToken._id).select("-password -refreshToken -recordings");

        if (!user) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid Token."
                    }
                )
        }

        const newOTP = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await User.findByIdAndUpdate(decodedToken._id, {$set: {otp: newOTP, otpExpires: otpExpires}});

        sendVerificationEmail(user.email, newOTP);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res
        .status(200)
        .json(
            {
                statusCode: 200,
                success: true,
                message: "Verification OTP sent. Check Your Email."
            }
        )
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req?.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(
                    {
                        statusCode: 400,
                        success: false,
                        message: "Email and Password are required."
                    }
                )
        }

        if (!(validateEmail(email) && validatePassword(password))) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid Credentials."
                    }
                )
        }

        const user = await User.findOne({ email });

        if(!user.isVerified){
            return res
            .status(402)
            .json(
                {
                    statusCode: 402,
                    success: false,
                    message: "Email not verified yet. Verify Email to Login."
                }
            )
        }

        if (!user) {
            return res
                .status(404)
                .json(
                    {
                        statusCode: 404,
                        success: false,
                        message: "User not found."
                    }
                )
        }

        const passwordCorrect = await user.isPasswordCorrect(password);

        if (!passwordCorrect) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Wrong Password."
                    }
                )
        }

        const { accessToken, refreshToken } = await generateUserAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -updatedAt -recordings");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    statusCode: 200,
                    data: { user: loggedInUser, accessToken, refreshToken, isGuest: false },
                    success: true,
                    message: "User logged in successfully."
                }
            )
    } catch (error) {
        throw new ApiError(500, error?.message)
    }
};

const registerGuest = async (req, res, next) => {
    try {
        const generatedRandomName = Guest.generateRandomGuestName();

        const guestUser = await Guest.create({ name: generatedRandomName });

        const createdGuestUser = await Guest.findById(guestUser._id).select("-refreshToken -updatedAt");

        if (!createdGuestUser) {
            return res
                .status(500)
                .json(
                    {
                        statusCode: 500,
                        success: false,
                        message: "Guest user registration failed."
                    }
                )
        }

        const { accessToken, refreshToken } = await generateGuestAccessAndRefreshTokens(createdGuestUser._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json(
                {
                    statusCode: 200,
                    data: { user: createdGuestUser, accessToken, refreshToken, isGuest: true },
                    message: "Guest User Registered Successfully",
                    success: true
                }
            )
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const convertGuestAccount = async (req, res) => {
    try {
        const user = req?.user;

        const { email, firstname, lastname, password } = req?.body;

        if (
            [firstname, lastname, email].some((field) => field?.trim() === "")
        ) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "All fields are required."
                    }
                )
        }

        if (!(validateEmail(email) && validateName(firstname) && validateName(lastname) && validatePassword(password))) {
            return res
                .status(400)
                .json(
                    {
                        statusCode: 400,
                        success: false,
                        message: "Invalid Credentials."
                    }
                )
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(409)
                .json(
                    {
                        statusCode: 409,
                        success: false,
                        message: "User with email already exists."
                    }
                )
        }

        const createUser = await User.create({ firstname, lastname, email, password });

        const createdUser = await User.findById(createUser._id).select(
            "-password -refreshToken -updatedAt -recordings"
        )

        if (!createdUser) {
            return res
                .status(501)
                .json(
                    {
                        statusCode: 501,
                        success: false,
                        message: "Something went wrong while saving the user."
                    }
                )
        }

        const guestRecordings = await Guest.findById(user._id).select(
            "+recordings"
        );

        // Update owner type of recordings 
        const updateOwner = await Recording.updateMany({ owner: user._id }, { owner: createdUser._id, ownerType: "User" });

        const updateCreatedUserRecordings = await User.findByIdAndUpdate(createdUser._id, { recordings: guestRecordings });

        const deleteGuest = await Guest.findByIdAndDelete(user._id);

        if (!deleteGuest) {
            return res.
                status(501)
                .json(
                    {
                        statusCode: 501,
                        success: false,
                        message: "Something went wrong while saving the user."
                    }
                )
        }

        const options = { httpOnly: true, secure: true };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                {
                    statusCode: 200,
                    success: true,
                    message: "Guest Account Converted Successfully."
                }
            )
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        const user = req?.user;

        const userUpdate = await User.findByIdAndUpdate(
            user._id,
            { $set: { refreshToken: null } },
            { new: true }
        ).select("-password -refreshToken");

        // Check if user update was successful
        if (!userUpdate) {
            throw new ApiError(500, "Logout Failed.");
        }

        const options = { httpOnly: true, secure: true };

        // Clear cookies and send response
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                statusCode: 200,
                data: { user: userUpdate },
                success: true,
                message: "Logout Successful"
            });
    } catch (error) {
        // Handle errors, if any
        throw new ApiError(500, error?.message);
    }
};


// When a guest user logs out, the user authomatically gets deleted, Alert user about this.
const logoutGuest = async (req, res, next) => {
    try {
        const user = req?.user;

        const userDelete = await Guest.findByIdAndDelete(user._id);

        if (!userDelete) {
            return res
                .status(500)
                .json(
                    {
                        statusCode: 500,
                        success: false,
                        message: "Logout failed."
                    }
                )
        }

        const options = { httpOnly: true, secure: true };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                statusCode: 200,
                data: { user: userDelete },
                success: true,
                message: "Logout Successfull"
            })
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email } = req.body;
        const user = req.user;

        if (
            [firstname, lastname, email].some((field) => field?.trim() === "")
        ) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "All fields are required.",
            });
        }

        if (!(validateEmail(email) && validateName(firstname) && validateName(lastname))) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Invalid Credentials.",
            });
        }

        const userUpdate = await User.findByIdAndUpdate(
            user._id,
            { $set: { firstname, lastname, email } },
            { new: true }
        ).select("-password -refreshToken");

        if (!userUpdate) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Update Failed.",
            });
        }

        return res.status(200).json({
            statusCode: 200,
            data: { user: userUpdate },
            success: true,
            message: "Update Successful.",
        });
    } catch (error) {
        throw new ApiError(500, error?.message || "Update Failed.");
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (
            [oldPassword, newPassword].some((field) => field?.trim() === "")
        ) {
            return res
                .status(400)
                .json(
                    {
                        statusCode: 400,
                        success: false,
                        message: "All fields are required."
                    }
                )

        }

        if (!(validatePassword(oldPassword) && validatePassword(newPassword))) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid format."
                    }
                )
        }

        const passwordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!passwordCorrect) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid Password."
                    }
                )
        }

        const updatedPasswordUser = await User.findOneAndUpdate({ _id: user._id }, { password: newPassword }, { new: true }).select("-password -refreshToken -updatedAt");

        if (!updatedPasswordUser) {
            return res
                .status(500)
                .json(
                    {
                        statusCode: 500,
                        success: false,
                        message: "Password Update Failed."
                    }
                );
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                data: { user: updatedPasswordUser },
                success: true,
                message: "Password Update Successfull"
            })
    } catch (error) {
        throw new ApiError(500, error?.message || "Password Update Failed.");
    }
}

const forgotPasswordEmailVerification = async (req, res) => {
    try {

    } catch (error) {
        throw new ApiError(500, error?.message || "Password Update Failed.");
    }
}

const forgotPasswordEmailSend = async (req, res) => {
    try {
        const {email} = req?.body;

    } catch (error) {
        throw new ApiError(500, error?.message || "Password Update Failed.");
    }
}

const forgotPasswordUpdate = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (
            [oldPassword, newPassword].some((field) => field?.trim() === "")
        ) {
            return res
                .status(400)
                .json(
                    {
                        statusCode: 400,
                        success: false,
                        message: "All fields are required."
                    }
                )

        }

        if (!(validatePassword(oldPassword) && validatePassword(newPassword))) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid format."
                    }
                )
        }

        const passwordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!passwordCorrect) {
            return res
                .status(401)
                .json(
                    {
                        statusCode: 401,
                        success: false,
                        message: "Invalid Password."
                    }
                )
        }

        const updatedPasswordUser = await User.findOneAndUpdate({ _id: user._id }, { password: newPassword }, { new: true }).select("-password -refreshToken -updatedAt");

        if (!updatedPasswordUser) {
            return res
                .status(500)
                .json(
                    {
                        statusCode: 500,
                        success: false,
                        message: "Password Update Failed."
                    }
                );
        }

        return res
            .status(200)
            .json({
                statusCode: 200,
                data: { user: updatedPasswordUser },
                success: true,
                message: "Password Update Successfull"
            })
    } catch (error) {
        throw new ApiError(500, error?.message || "Password Update Failed.");
    }
}

const getUserDetails = async (req, res, next) => {
    try {
        const user = req.user;

        return res
            .status(200)
            .json(
                {
                    statusCode: 200,
                    data: { user, isGuest: req.isGuest },
                    success: true,
                    message: "User details fetched successfully."
                }
            )
    } catch (error) {
        throw new ApiError(500, "User details fetching failed.");
    }
}


const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { password } = req.body;

    const passwordCorrect = user.isPasswordCorrect(password);

    if (!passwordCorrect) {
        return res
            .status(404)
            .json(
                {
                    statusCode: 404,
                    success: false,
                    message: "Incorrect Password."
                }
            )
    }

    const userDelete = await User.findByIdAndDelete(user._id);

    if (!userDelete) {
        throw new ApiError(500, "Account deletion failed.");
    }

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            {
                statusCode: 200,
                message: "Account Deletion Successfull.",
                success: true
            }
        );
}

const updateAccessToken = async (req, res, next) => {
    const token = req.cookies?.refreshToken || req.headers["Authorization"]?.replace("Bearer ", "");

    jwt.verify(token, process.env.USER_REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            jwt.verify(token, process.env.GUEST_REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res
                        .status(401)
                        .json(
                            {
                                statusCode: 401,
                                success: false,
                                message: "Invalid Refresh Token."
                            }
                        )
                }

                const guestUser = await Guest.findById(decoded._id);

                if (!guestUser) {
                    return res
                        .status(404)
                        .json(
                            {
                                statusCode: 404,
                                success: false,
                                message: "User not found."
                            }
                        )
                }

                const accessToken = await guestUser.generateAccessToken();

                return res
                    .status(200)
                    .cookie("accessToken", accessToken)
                    .json(
                        {
                            data: { accessToken, isGuest: true },
                            statusCode: 200,
                            success: true,
                            message: "Access Token Updated."
                        }
                    )
            })
        }
        else {
            const user = await User.findById(decoded._id);

            if (!user) {
                return res
                    .status(404)
                    .json(
                        {
                            statusCode: 404,
                            success: false,
                            message: "User not found."
                        }
                    )
            }

            const accessToken = await user.generateAccessToken();

            return res
                .status(200)
                .cookie("accessToken", accessToken)
                .json(
                    {
                        data: { accessToken, isGuest: false },
                        statusCode: 200,
                        success: true,
                        message: "Access Token Updated."
                    }
                )
        }
    });
}

export { registerUser, loginUser, registerGuest, logoutUser, logoutGuest, updateUser, updatePassword, getUserDetails, deleteUser, updateAccessToken, isAuthenticated, convertGuestAccount, verifyEmail, resendOTP };
