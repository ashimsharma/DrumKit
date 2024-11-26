import mongoose, {Schema} from "mongoose";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import jwt from "jsonwebtoken";

const guestSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        refreshToken: {
            type: String,
        },
        recordings: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Recording'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

guestSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name
        },
        process.env.GUEST_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.GUEST_ACCESS_TOKEN_EXPIRY
        }
    )
}

guestSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.GUEST_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.GUEST_REFRESH_TOKEN_EXPIRY
        }
    )
}

guestSchema.statics.generateRandomGuestName = function(){
    return uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        style: 'capital',
        separator: '-',
        seed: 'DK'
    });
}

export const Guest = mongoose.model('Guest', guestSchema);