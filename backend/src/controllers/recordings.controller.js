import {ApiError} from "../utils/ApiError.js"
import mongoose from "mongoose";
import { Recording } from "../models/recordings.model.js";
import { User } from "../models/users.model.js";
import { Guest } from "../models/guests.model.js";

const saveRecording = async (req, res, next) => {
    try {
        const user = req.user;
        const isGuest = req.isGuest;

        if(!user){
            throw new ApiError(401, "Unauthorized Request.")
        }
        
        const {data} = req.body;
        
        const createdRecording = await Recording.create(
            {
                name: data.name,
                recordedData: data.recordedData,
                ownerType: isGuest ? "Guest" : "User"
            }
        );

        if(!isGuest){
            await User.findByIdAndUpdate(user._id, {"$push": {recordings: createdRecording._id}},{new: true});
        }
        else{
            await Guest.findByIdAndUpdate(user._id, {"$push": {recordings: createdRecording._id}}, {new: true});
        }

        return res
        .status
        .json(
            {
                statusCode: 200,
                success: true,
                message: "Recording created successfully."
            }
        )
    } catch (error) {
        throw new ApiError(501, "Something went wrong while saving recording.");
    }

}

const getAllRecordings = async (req, res, next) => {
    try {
        const user = req.user;

        if(!user){
            return res
            .status(401)
            .json(
                {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized Request."
                }
            )
        }

        const pipeline = [
            {
                "$match": {
                    "owner": user._id
                },
            },
            {
                "$project": {
                    "name": 1,
                    "recordedData": 1,
                    "createdAt": 1
                }
            },
            {
                "$sort": {
                    "createdAt": -1
                }
            }
        ];

        const recordings = await Recording.aggregate(pipeline);

        return res
        .status(200)
        .json(
            {
                statusCode: 200,
                data: {recordings},
                success: true,
                message: "Recordings fetched successfully."
            }
        )
    } catch (error) {
        throw new ApiError(501, error?.message)
    }
}


const deleteRecording = async (req, res, next) => {
    const user = req.user;
    const {id} = req.body;

    if(!user){
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

    const deletedRecording = await Recording.findByIdAndDelete(id);

    if(!deletedRecording){
        return res
        .status(500)
        .json(
            {
                statusCode: 500,
                success: false,
                message: "Something went wrong while deleting recording."
            }
        )
    }

    const updatedRecordings = await User.findByIdAndUpdate(user._id, {$pull: {recordings: mongoose.Types.ObjectId(deletedRecording._id)}}, {new: true}).select("+recordings");

    if(!updatedUser){
        return res
        .status(500)
        .json(
            {
                statusCode: 500,
                success: false,
                message: "Something went wrong while updating user"
            }
        )
    }

    return res
    .status(200)
    .json(
        {
            statusCode: 200,
            success: true,
            message: "Recording Deleted."
        }
    )
}

export {getAllRecordings, saveRecording, deleteRecording};