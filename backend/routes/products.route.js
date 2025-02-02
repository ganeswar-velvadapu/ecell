const { getAllProducts, addProduct, editProduct, deleteProduct, getSpecificProduct, addToCart, deleteFromCart, getAllProductsFromCart } = require("../controllers/products.controller")
const { authenticateUser } = require("../middlewares/checkToken")

const router = require("express").Router()

router.get("/products",getAllProducts)
router.get("/products/:productId",getSpecificProduct)
router.post("/products", authenticateUser, addProduct)
router.put("/products/:productId", authenticateUser, editProduct)
router.delete("/products/:productId", authenticateUser, deleteProduct)
router.post("/products/cart/:productId",authenticateUser,addToCart)
router.delete("/products/cart/:productId",authenticateUser,deleteFromCart)
// router.get("/products/cart",)
router.get("/products/cart", (req, res) => {
    res.status(200).json({ message: "No handler assigned, but route exists." });
});


module.exports = router