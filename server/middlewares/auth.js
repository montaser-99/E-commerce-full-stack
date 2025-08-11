// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    // console.log(" auth middleware reached");

    const token = req.cookies?.accessToken;
    if (!token) {
      // console.log(" No token found in cookies");
      return res.status(401).json({ message: "Unauthorized", error: true, success: false });
    }

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
    const user = await User.findById(decoded?.id);
    if (!user) {
      // console.log("User not found");
      return res.status(401).json({ message: "User not found", error: true, success: false });
    }

    req.user = user;
    req.userid = user._id;
    // console.log("User authenticated:", user.email);

    next();
  } catch (err) {
    // console.error(" Error in auth middleware:", err);
    return res.status(401).json({ message: "Invalid token", error: true, success: false });
  }
};
