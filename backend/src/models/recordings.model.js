import mongoose, { Schema } from "mongoose";

const recordingSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        recordedData: [
            [String, Number]
        ],
        owner: {
            type: Schema.Types.ObjectId,
            refPath: 'ownerType',
            required: true
        },
        ownerType: {
            type: String,
            required: true,
            enum: ["User", "Guest"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Recording = mongoose.model('Recording', recordingSchema);