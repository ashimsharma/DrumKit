import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI);

        if(!dbConnection){
            throw new ApiError(500, "Database Connection Failed.");
        }

        return dbConnection;
    } catch (error) {
        throw new ApiError(500, "Database Connection Failed.");
    }
}

export default connectDB;