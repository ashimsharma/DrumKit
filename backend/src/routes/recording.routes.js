import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { deleteRecording, getAllRecordings, saveRecording } from "../controllers/recordings.controller.js";

const recordingRouter = Router();


recordingRouter.route("/post-recording").post(verifyJWT, saveRecording);

recordingRouter.route("/get-recordings").get(verifyJWT, getAllRecordings);

recordingRouter.route("/delete-recording").delete(verifyJWT, deleteRecording);

export default recordingRouter;