import Router from "express";
import { deleteUser, getUserDetails, loginUser, logoutGuest, logoutUser, registerGuest, registerUser, updateAccessToken, updatePassword, updateUser, isAuthenticated, convertGuestAccount, verifyEmail, resendOTP, forgotPasswordSendEmail, generateNewPassword, sendOTP } from "../controllers/users.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);

userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/resend-otp").post(resendOTP);
userRouter.route("/forgot-password-send-email").post(forgotPasswordSendEmail);
userRouter.route("/login").post(loginUser);
userRouter.route("/register-guest").post(registerGuest);
userRouter.route("/update-accesstoken").post(updateAccessToken);
userRouter.route("/generate-new-password").patch(generateNewPassword);
userRouter.route("/send-otp").post(sendOTP);

//secured routes
userRouter.route("/logout-user").post(verifyJWT, logoutUser);
userRouter.route("/logout-guest").delete(verifyJWT, logoutGuest); // Using delete for logging out guest because account will get deleted.
userRouter.route("/update-user").patch(verifyJWT, updateUser);
userRouter.route("/update-password").patch(verifyJWT, updatePassword);
userRouter.route("/get-user").get(verifyJWT, getUserDetails);
userRouter.route("/delete-user").delete(verifyJWT, deleteUser);
userRouter.route("/convert-guest").post(verifyJWT, convertGuestAccount);
userRouter.route("/delete-account").post(verifyJWT, deleteUser);

// Check Authentication Route
userRouter.route("/check-auth").get(verifyJWT, isAuthenticated);

export default userRouter;