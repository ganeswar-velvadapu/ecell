const pool = require("../config/db");

const getAllProducts = async (req, res) => {
    try {
        const queryProducts = await pool.query("SELECT * FROM products");
        const allProducts = queryProducts.rows;
        return res.json({
            message: "All Products",
            products: allProducts
        });
    } catch (error) {
        console.log("Error fetching products:", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

const getSpecificProduct = async  (req,res)=>{
    try {
        const {productId} = req.params
        const productQuery = await pool.query("select * from products where product_id = $1",[productId])
        const product = productQuery.rows[0]
        return res.json({
            message : "Product Fetched",
            product : product
        })
    } catch (error) {
        return res.json({
            message : "Internal Server Error"
        })
    }
}

const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (actualUser.role != "Admin") {
            return res.status(403).json({
                message: "You are not allowed to add product"
            });
        }

        const { productPrice, productName, imageUrl, productDescription, manufacturer } = req.body;
        if (!productDescription || !productName || !productPrice || !manufacturer) {
            return res.status(400).json({
                message: "Provide necessary details to add product."
            });
        }

        const product = await pool.query(
            "INSERT INTO products (product_price, product_name, image_url, product_description, created_by,manufacturer) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
            [productPrice, productName, imageUrl, productDescription, actualUser.user_id,manufacturer]
        );

        return res.status(201).json({
            message: "Product added successfully.",
            product: product.rows[0]
        });
    } catch (error) {
        console.log("Error adding product:", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;
        const { productId } = req.params;
        console.log(productId)
        const { productPrice, productName, imageUrl, productDescription } = req.body;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (actualUser.role != "Admin") {
            return res.status(403).json({ message: "You are not allowed to add product" });
        }

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [productId]);
        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = productQuery.rows[0];
        if (product.created_by !== actualUser.user_id) {
            return res.status(403).json({ message: "You are not authorized to update this product." });
        }

        const updatedProduct = await pool.query(
            "UPDATE products SET product_price = $1, product_name = $2, image_url = $3, product_description = $4 WHERE product_id = $5 RETURNING *",
            [productPrice, productName, imageUrl, productDescription, productId]
        );

        return res.json({
            message: "Product updated successfully.",
            product: updatedProduct.rows[0]
        });
    } catch (error) {
        console.log("Error updating product:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;
        const { productId } = req.params;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (actualUser.role != "Admin") {
            return res.status(403).json({ message: "Only partners can delete products." });
        }

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [productId]);
        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = productQuery.rows[0];
        if (product.created_by !== actualUser.user_id) {
            return res.status(403).json({ message: "You are not authorized to delete this product." });
        }

        await pool.query("DELETE FROM products WHERE product_id = $1", [productId]);

    return res.json({ message: "Product deleted successfully." })
    } catch (error) {
        console.log("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};
const addToCart = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const { productId } = req.params;

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [productId]);
        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const userCartQuery = await pool.query("SELECT * FROM cart WHERE user_id = $1", [userId]);

        if (userCartQuery.rows.length === 0) {
            const newCart = await pool.query(
                "INSERT INTO cart (user_id, products) VALUES ($1, $2) RETURNING *",
                [userId, JSON.stringify([productId])]
            );
            return res.json({ message: "Product added to cart", cart: newCart.rows[0] });
        } else {
            const cart = userCartQuery.rows[0];
            const existingProducts = cart.products || []; 

            if (existingProducts.includes(productId)) {
                return res.status(400).json({ message: "Product already exists in cart." });
            }

            const updatedCart = await pool.query(
                `UPDATE cart 
                 SET products = products || $1::jsonb 
                 WHERE user_id = $2 RETURNING *`,
                [JSON.stringify([productId]), userId]
            );

            return res.json({ message: "Product added to cart successfully", cart: updatedCart.rows[0] });
        }
    } catch (error) {
        console.log("Add to Cart Error:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

const deleteFromCart = async (req, res) => {
    try {
        const user = req.user; 
        const userId = user.id; 
        const { productId } = req.params;

        const userCartQuery = await pool.query("SELECT * FROM cart WHERE user_id = $1", [userId]);

        if (userCartQuery.rows.length === 0) {
            return res.status(404).json({ message: "Cart is empty or user does not have a cart." });
        }

        const cartProducts = userCartQuery.rows[0].products;

        if (!cartProducts.some(id => id === productId)) {
            return res.status(400).json({ message: "Product not found in cart." });
        }

        const updatedCart = await pool.query(
            `UPDATE cart 
             SET products = products - $1
             WHERE user_id = $2 
             RETURNING *`,
            [productId, userId]
        );

        return res.json({ message: "Product removed from cart successfully", cart: updatedCart.rows[0] });
    } catch (error) {
        console.log("Delete from Cart Error:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

const getAllProductsFromCart = async (req, res) => {
    
};


module.exports = { getAllProducts, addProduct, editProduct, deleteProduct,getSpecificProduct,addToCart,deleteFromCart,getAllProductsFromCart };
