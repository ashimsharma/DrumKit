import Router from "express";
import { deleteUser, getUserDetails, loginUser, logoutGuest, logoutUser, registerGuest, registerUser, updateAccessToken, updatePassword, updateUser } from "../controllers/users.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/register-guest").post(registerGuest);
userRouter.route("/update-accesstoken").post(updateAccessToken);

//secured routes
userRouter.route("/logout-user").post(verifyJWT, logoutUser);
userRouter.route("/logout-guest").delete(verifyJWT, logoutGuest); // Using delete for logging out guest because account will get deleted.
userRouter.route("/update-user").patch(verifyJWT, updateUser);
userRouter.route("/update-password").patch(verifyJWT, updatePassword);
userRouter.route("/get-user").get(verifyJWT, getUserDetails);
userRouter.route("/delete-user").delete(verifyJWT, deleteUser);

export default userRouter;