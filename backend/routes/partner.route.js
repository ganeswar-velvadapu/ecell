const { getAllPartners, requestPartner, addPartner } = require("../controllers/partner.controller")
const { authenticateUser } = require("../middlewares/checkToken")

const router = require("express").Router

router.get("/partner",authenticateUser,getAllPartners)
router.post("/partner",authenticateUser,requestPartner)
router.post("/partner/add",authenticateUser,addPartner)



module.exports = router