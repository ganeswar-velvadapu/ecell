const { getAllProducts, addProduct, editProduct, deleteProduct } = require("../controllers/products.controller")
const { authenticateUser } = require("../middlewares/checkToken")

const router = require("express").Router()

router.get("/products", getAllProducts)
router.post("/products", authenticateUser, addProduct)
router.put("/products", authenticateUser, editProduct)
router.delete("/products", authenticateUser, deleteProduct)

module.exports = router