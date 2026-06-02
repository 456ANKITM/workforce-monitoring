import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        if(req.cookies && req.cookies.token) {
            token = req.cookies.token
        }
        if(!token) {
            return res.status(401).json({
                success:false, 
                message:"Not Authorized, no token"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if(!user) {
            return res.status(401).json({
                success:false, 
                message:"User not found"
            })
        }

        req.user = user;
        next();
    } catch (error) {
         return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
    }
}