const { getAllProducts, addProduct, editProduct, deleteProduct, getSpecificProduct, addToCart, deleteFromCart, getAllProductsFromCart, buyProduct, getOrders, cancelOrder, getOrderRequests } = require("../controllers/products.controller")
const { authenticateUser } = require("../middlewares/checkToken")

const router = require("express").Router()

router.get("/products",getAllProducts)
router.get("/products/orders",authenticateUser,getOrders)
router.get("/products/:productId",getSpecificProduct)
router.post("/products", authenticateUser, addProduct)
router.put("/products/:productId", authenticateUser, editProduct)
router.delete("/products/orders/cancel/:orderId",authenticateUser,cancelOrder)
router.delete("/products/:productId", authenticateUser, deleteProduct)
router.post("/products/:id/buy",authenticateUser,buyProduct)
router.get("/products/orders/requests",authenticateUser,getOrderRequests)

module.exports = router