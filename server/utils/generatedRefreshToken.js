import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'


const generateRefreshToken = async (userId) => {
    if (!process.env.REFRESHTOKEN_SECRET) {
        throw new Error("Missing SECRET_KEY_REFRESH_TOKEN in environment variables.");
    }

    const token = jwt.sign( 
        { id: userId },
        process.env.REFRESHTOKEN_SECRET,
        { expiresIn: '7d' }
    ); 

    const updateResult = await User.updateOne(
        { _id: userId },
        { refresh_token: token }
    );

    if (updateResult.modifiedCount === 0) { 
        throw new Error("Failed to update refresh token for the user.");
    }

    return token;
}

export default generateRefreshToken;
