import jwt from "jsonwebtoken";

export default function generateVerificationToken(id, email){
    return jwt.sign(
        {
            _id: id,
            email
        },
        process.env.VERIFICATION_TOKEN_SECRET,
        {
            expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY
        }
    )
}