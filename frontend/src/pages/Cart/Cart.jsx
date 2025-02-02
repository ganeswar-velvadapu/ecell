import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductLayout from "../../components/Products/ProductLayout";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/cart`, { withCredentials: true });
        console.log(response)
        console.log("Cart API Response:", response.data);  // Debugging
        
        if (response.data && Array.isArray(response.data.products)) {
          setCartProducts(response.data.products);
        } else {
          setCartProducts([]); 
        }
      } catch (error) {
        console.log("Error fetching cart products:", error);
        setCartProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchCartProducts();
  }, []);
  
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/cart/${productId}`, { withCredentials: true });
      setCartProducts(cartProducts.filter((product) => product.product_id !== productId));
    } catch (error) {
      console.log("Error removing product from cart:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : cartProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartProducts.map((product) => (
            <div key={product.product_id} className="relative">
              <ProductLayout {...product} />
              <button
                onClick={() => removeFromCart(product.product_id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
