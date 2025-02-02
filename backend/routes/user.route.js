const { Login, SignUp, Logout, checkUser } = require("../controllers/user.controller")

const router = require("express").Router()

router.post("/login",Login)
router.post("/signup",SignUp)
router.get("/logout",Logout)
router.get("/me",checkUser)


module.exports = router