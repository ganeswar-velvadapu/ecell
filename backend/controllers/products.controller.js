const pool = require("../config/db")

const getAllProducts = async (req, res) => {
    const queryProducts = await pool.query("select * from products")
    const allProducts = queryProducts.rows
    console.log(allProducts)
    res.json({
        message: "All Products",
        products: allProducts
    })
}

const addProduct = async (req, res) => {
    const user = req.user
    const role = user.role
    const email = user.email
    const actualUserQuery = await pool.query("select * from users where email = $1", [email])
    const actualUser = actualUserQuery.rows[0]
    if (actualUser.role != role) {
        return res.json({
            message: "Don't try to act smart."
        })
    }

    if (actualUser.role != "admin") {
        return res.json({
            message: "You are not authorized to add a product."
        })
    }

    if(!actualUser.partner_status){
        return res.json({
            message : "Become a partner to add a product."
        })
    }

    const { productPrice, productName, imageUrl, productDescription } = req.body

    if(!productDescription || !productName || !productPrice){
        return res.json({
            message : "Provide necessary details to add product."
        })
    }

    const product = await pool.query("insert into products (product_price,product_name,image_url,product_description) values ($1,$2,$3,$4) returning *", [productPrice, productName, imageUrl, productDescription])
    console.log(product)

}

const editProduct = (req, res) => {

}

const deleteProduct = (req, res) => {
    
}   



module.exports = { getAllProducts, editProduct, addProduct, deleteProduct }