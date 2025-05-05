import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const ProtectedRoute = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized access - No token provided I'm afraid"});
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) return res.status(401).json({message: "Invalid Token sth about it smells fishy"});

        const user = await User.findById(decode.userId).select("-password");

        if(!user) return res.status(401).json({message: "The database doesn't recognize you buddy you're not on his list"});

        req.user = user;

        next();
        
    } catch (error) {
        console.error("Error in protectedRoute middleware", error);
        res.status(500).json({message: "Server just snobbed you like your ex after trying to contact her again"});
    }
}