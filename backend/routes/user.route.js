const { Login, SignUp, Logout } = require("../controllers/user.controller")

const router = require("express").Router()

router.post("/login",Login)
router.post("/signup",SignUp)
router.get("/logout",Logout)


module.exports = router