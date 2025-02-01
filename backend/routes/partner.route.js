const { getAllPartners, requestPartner } = require("../controllers/partner.controller")
const { authenticateUser } = require("../middlewares/checkToken")

const router = require("express").Router()

router.get("/partner",getAllPartners)
router.post("/partner",authenticateUser,requestPartner)



module.exports = router