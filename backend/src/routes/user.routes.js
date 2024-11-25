import Router from "express";
import { getUserDetails, loginUser, logoutGuest, logoutUser, registerGuest, registerUser, updatePassword, updateUser } from "../controllers/users.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/register-guest").post(registerGuest);

//secured routes
userRouter.route("/logout-user").post(verifyJWT, logoutUser);
userRouter.route("/logout-guest").delete(verifyJWT, logoutGuest); // Using delete for logging out guest because account will get deleted.
userRouter.route("/update-user").patch(verifyJWT, updateUser);
userRouter.route("/update-password").patch(verifyJWT, updatePassword);
userRouter.route("/get-user").get(verifyJWT, getUserDetails);
userRouter.route("/delete-user").delete(verifyJWT, getUserDetails);

export default userRouter;