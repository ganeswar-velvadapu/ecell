require("dotenv").config();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sign Up function
const SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return res.json({
                message : "Provide necessary details."
            })
        }

        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashPassword]
        );
        const token = generateJwt({
            id: newUser.rows[0].id,
            username: newUser.rows[0].username,
            email: newUser.rows[0].email,
            rewardPoints : newUser.rows[0].rewardPoints,
            role : newUser.rows[0].role
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: "strict",
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
        });
    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).json({
            message: "Internal server error. Try again after some time.",
        });
    }
};

// Login function
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if(!email,!password){
            return res.json({
                message : "Enter all details."
            })
        }

        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ message: "User not found. Try Sign Up" });
        }

        const user = existingUser.rows[0];
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        console.log(user)
        const token = generateJwt({
            id: user.id,
            username: user.username,
            email: user.email,
            reward_points : user.reward_points,
            role: user.role
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: "strict",
        });

        return res.json({ message: "Login Successful" });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error. Try again after some time." });
    }
};


//Logout function
const Logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.json({
        message : "Logout Sucessfull"
    })
};


// JWT Token Generator
function generateJwt({ id, username, email,reward_points,role }) {
    return jwt.sign(
        { id, username, email,reward_points,role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } 
    );
}




module.exports = { Login, SignUp,Logout };
