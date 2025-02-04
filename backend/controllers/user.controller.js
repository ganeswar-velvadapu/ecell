require("dotenv").config();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
        id: newUser.rows[0].user_id,
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
        console.log("SignUp Error:", error);
        return res.status(500).json({
            message: "Internal server error. Try again after some time.",
        });
    }
};


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
        const token = generateJwt({
            id: user.user_id,
            username: user.username,
            email: user.email,
            reward_points : user.reward_points,
            role: user.role,
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        return res.json({ message: "Login Successful" });
    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({ message: "Internal server error. Try again after some time." });
    }
};



const Logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.json({
        message : "Logout Sucessfull"
    })
};

const checkUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (!actualUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: actualUser.user_id,
                email: actualUser.email,
                username: actualUser.username,
                role: actualUser.role,
                reward_points: actualUser.reward_points,
                exp: decoded.exp,
                iat: decoded.iat,
            },
        });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


function generateJwt({ id, username, email,reward_points,role }) {
    return jwt.sign(
        { id, username, email,reward_points,role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } 
    );
}




module.exports = { Login, SignUp,Logout,checkUser };
