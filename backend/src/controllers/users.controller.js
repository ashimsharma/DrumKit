import { Guest } from "../models/guests.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { validateEmail, validateName, validatePassword } from "../utils/Validation.js";
import jwt, { decode } from "jsonwebtoken";

const isAuthenticated = (req, res) => {
    const user = req?.user;

    if(!user){
        return res
        .status(401)
        .json(
            {
                success: false,
                statusCode: 401,
                message: "Unauthorized Request"
            }
        )
    }

    return res
    .status(200)
    .json(
        {
            success: true,
            statusCode: 200,
            message: "Authorized User."
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

        const user = await User.create({ firstname, lastname, email, password });

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

        return res.status(200)
            .json(
                {
                    statusCode: 200,
                    data: { user: createdUser},
                    message: "User Registered Successfully",
                    success: true
                }
            );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while registering the user.");
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

const logoutUser = async (req, res, next) => {
    try {
        const user = req?.user;

        // Set refreshToken to null in the database
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
        throw new ApiError(500, error?.message || "Logout Failed.");
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
        throw new ApiError(500, error?.message || "Logout Failed.");
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email } = req.body;
        const user = req.user;

        if (
            [firstname, lastname, email].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required.");
        }

        if (!(validateEmail(email) && validateName(firstname) && validateName(lastname))) {
            throw new ApiError(400, "Invalid credentials.");
        }

        const userUpdate = await User.findByIdAndUpdate(
            user._id,
            { $set: { firstname, lastname, email } },
            { new: true }
        ).select("-password -refreshToken");

        if (!userUpdate) {
            throw new ApiError(500, "Update Failed.");
        }

        return res.status(200).json({
            statusCode: 200,
            data: { user: userUpdate },
            success: true,
            message: "Update Successful",
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
    const { token, isGuest } = req.body;

    if (!token) {
        return res
            .status(401)
            .json(
                {
                    statusCode: 401,
                    success: false,
                    message: "Access Token is required."
                }
            );
    }

    //Todo: Remove Code Duplication.(modularise)
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
                                message: "Invalid Access Token."
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

                const accessToken = guestUser.generateAccessToken();

                return res
                    .status(200)
                    .cookie("accessToken", accessToken)
                    .json(
                        {
                            data: { accessToken },
                            statusCode: 200,
                            success: true,
                            message: "Access Token Updated."
                        }
                    )
            })
        }

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

        const accessToken = user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .json(
                {
                    data: { accessToken },
                    statusCode: 200,
                    success: true,
                    message: "Access Token Updated."
                }
            )
    });
}

export { registerUser, loginUser, registerGuest, logoutUser, logoutGuest, updateUser, updatePassword, getUserDetails, deleteUser, updateAccessToken, isAuthenticated };
