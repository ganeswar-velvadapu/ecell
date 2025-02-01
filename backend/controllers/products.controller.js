const pool = require("../config/db");

const getAllProducts = async (req, res) => {
    try {
        const queryProducts = await pool.query("SELECT * FROM products");
        const allProducts = queryProducts.rows;
        console.log(allProducts);
        return res.json({
            message: "All Products",
            products: allProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (!actualUser.partner_status) {
            return res.status(403).json({
                message: "Become a partner to add a product."
            });
        }

        const { productPrice, productName, imageUrl, productDescription } = req.body;
        if (!productDescription || !productName || !productPrice) {
            return res.status(400).json({
                message: "Provide necessary details to add product."
            });
        }

        const product = await pool.query(
            "INSERT INTO products (product_price, product_name, image_url, product_description, partner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [productPrice, productName, imageUrl, productDescription, actualUser.user_id]
        );

        return res.status(201).json({
            message: "Product added successfully.",
            product: product.rows[0]
        });
    } catch (error) {
        console.error("Error adding product:", error);
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
        const { productPrice, productName, imageUrl, productDescription } = req.body;

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const actualUser = actualUserQuery.rows[0];

        if (!actualUser.partner_status) {
            return res.status(403).json({ message: "Only partners can update products." });
        }

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [productId]);
        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = productQuery.rows[0];
        if (product.partner_id !== actualUser.user_id) {
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
        console.error("Error updating product:", error);
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

        if (!actualUser.partner_status) {
            return res.status(403).json({ message: "Only partners can delete products." });
        }

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [productId]);
        if (productQuery.rows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const product = productQuery.rows[0];
        if (product.partner_id !== actualUser.user_id) {
            return res.status(403).json({ message: "You are not authorized to delete this product." });
        }

        await pool.query("DELETE FROM products WHERE product_id = $1", [productId]);

        return res.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { getAllProducts, addProduct, editProduct, deleteProduct };
