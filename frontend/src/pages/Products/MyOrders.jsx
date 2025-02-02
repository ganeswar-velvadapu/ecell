import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/orders`, { withCredentials: true }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true)
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/orders/cancel/${orderId}`, { withCredentials: true });
      fetchOrders()
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white text-black mb-30 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found.</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-gray-200 border border-gray-700 rounded-lg shadow-md">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{order.product_name}</h2>
                    <p className="text-gray-400">Price: ${order.price}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.timestamp).toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Deliver to: {order.address}</p>
                    <p className="text-gray-400 text-sm">Mobile: {order.mobile}</p>
                  </div>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg mt-4"
                    onClick={() => cancelOrder(order.product_id)}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;