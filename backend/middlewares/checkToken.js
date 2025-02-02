require("dotenv").config()
const jwt = require("jsonwebtoken")
// Middleware for verifying JWT token
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({ message: "Hi" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {authenticateUser}