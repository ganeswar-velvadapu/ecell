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

const getSpecificProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const productQuery = await pool.query("select * from products where product_id = $1", [productId])
        const product = productQuery.rows[0]
        return res.json({
            message: "Product Fetched",
            product: product
        })
    } catch (error) {
        return res.json({
            message: "Internal Server Error"
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

        const { productPrice, productName, imageUrl, productDescription, manufacturer,isComboOffer } = req.body;
        if (!productDescription || !productName || !productPrice || !manufacturer || !isComboOffer) {
            return res.status(400).json({
                message: "Provide necessary details to add product."
            });
        }

        const product = await pool.query(
            "INSERT INTO products (product_price, product_name, image_url, product_description, created_by,manufacturer,combo) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
            [productPrice, productName, imageUrl, productDescription, actualUser.user_id, manufacturer,isComboOffer]
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
        const { product_price, product_name, image_url, product_description } = req.body;
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
            [product_price, product_name, image_url, product_description, productId]
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

const buyProduct = async (req, res) => {
    try {
        const user = req.user;
        const email = user.email;
        const { id } = req.params;
        const { mobile, address } = req.body;

        if (!mobile || !address) {
            return res.status(400).json({ message: "Enter user details." });
        }

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (actualUserQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const actualUser = actualUserQuery.rows[0];

        const productQuery = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);
        if (productQuery.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const product = productQuery.rows[0];

        const productCreatorId = product.created_by;
        if (!productCreatorId) {
            return res.status(400).json({ message: "Product creator not found." });
        }

        const adminQuery = await pool.query("SELECT * FROM users WHERE user_id = $1", [productCreatorId]);
        if (adminQuery.rowCount === 0) {
            return res.status(404).json({ message: "Product creator (admin) not found" });
        }
        const admin = adminQuery.rows[0];

        let userOrders = actualUser.orders || [];
        if (typeof userOrders === "string") {
            userOrders = JSON.parse(userOrders);
        }

        let adminOrders = admin.order_requests || [];
        if (typeof adminOrders === "string") {
            adminOrders = JSON.parse(adminOrders);
        }
        const newOrder = {
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.product_price - (user.reward_points) / 10,
            buyer_email: email,
            mobile,
            address,
            order_id: new Date().toISOString()
        };


        userOrders.push(newOrder);

        adminOrders.push(newOrder);

        const newRewardPoints = (actualUser.reward_points || 0) + 10;


        await pool.query(
            `UPDATE users 
             SET orders = $1::jsonb, 
                 reward_points = $2
             WHERE user_id = $3`,
            [JSON.stringify(userOrders), newRewardPoints, actualUser.user_id]
        );

        await pool.query(
            `UPDATE users 
             SET order_requests = $1::jsonb 
             WHERE user_id = $2`,
            [JSON.stringify(adminOrders), productCreatorId]
        );


        return res.status(200).json({
            message: "Order placed successfully",
            order: newOrder,
            total_orders: userOrders.length,
            reward_points: newRewardPoints
        });

    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error buying product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOrders = async (req, res) => {
    try {
        const user = req.user;
        const actualOrderQuery = await pool.query(
            "SELECT orders FROM users WHERE user_id = $1",
            [user.id]
        );
        if (actualOrderQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        let orders = actualOrderQuery.rows[0].orders || [];
        if (typeof orders === "string") {
            orders = JSON.parse(orders);
        }
        return res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
            total_orders: orders.length,
        });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const user = req.user;
        const { orderId } = req.params;
        const userQuery = await pool.query(
            "SELECT orders, reward_points FROM users WHERE user_id = $1",
            [user.id]
        );

        if (userQuery.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        let orders = userQuery.rows[0].orders || [];
        let rewardPoints = userQuery.rows[0].reward_points || 0;

        if (typeof orders === "string") {
            orders = JSON.parse(orders);
        }
        const orderIndex = orders.findIndex(order => order.product_id === orderId);
        if (orderIndex === -1) {
            return res.status(404).json({ message: "Order not found" });
        }
        orders.splice(orderIndex, 1);
        rewardPoints = Math.max(0, rewardPoints - 10); 

        const productQuery = await pool.query(
            "SELECT created_by FROM products WHERE product_id = $1",
            [orderId]
        );

        if (productQuery.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const creatorId = productQuery.rows[0].created_by;

        const creatorQuery = await pool.query(
            "SELECT order_requests FROM users WHERE user_id = $1",
            [creatorId]
        );

        if (creatorQuery.rowCount === 0) {
            return res.status(404).json({ message: "Creator not found" });
        }

        let creatorOrders = creatorQuery.rows[0].order_requests || [];
        if (typeof creatorOrders === "string") {
            creatorOrders = JSON.parse(creatorOrders);
        }

        creatorOrders = creatorOrders.filter(order => order.product_id !== orderId);

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            await client.query(
                "UPDATE users SET orders = $1, reward_points = $2 WHERE user_id = $3",
                [JSON.stringify(orders), rewardPoints, user.id]
            );

            await client.query(
                "UPDATE users SET order_requests = $1 WHERE user_id = $2",
                [JSON.stringify(creatorOrders), creatorId]
            );

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

        return res.status(200).json({
            message: "Order canceled successfully and reward points deducted",
            orders: orders,
            total_orders: orders.length,
            reward_points: rewardPoints
        });

    } catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getOrderRequests = async (req, res) => {
    try {
        const userID = req.user.id

        const actualUserQuery = await pool.query("SELECT * FROM users WHERE user_id = $1", [userID]);
        const actualUser = actualUserQuery.rows[0];

        return res.json({
            message: "Order requests fetched",
            requests: actualUser.order_requests
        })

    } catch (error) {
        console.log(error)
        return res.json({
            message: "Internal Server Error."
        })
    }
}



module.exports = { getAllProducts, addProduct, editProduct, deleteProduct, getSpecificProduct, buyProduct, getOrders, cancelOrder, getOrderRequests };
