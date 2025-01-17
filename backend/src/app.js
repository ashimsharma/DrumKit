import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes
import userRouter from "./routes/user.routes.js";
import recordingRouter from "./routes/recording.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());


// Route Handlers.
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recordings", recordingRouter);

export {app};