import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../Context/AuthContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState({ mobile: "", address: "" });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                setProduct(response.data.product);
                setEditedProduct(response.data.product);
            } catch (error) {
                console.log("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
                editedProduct,
                { withCredentials: true }
            );
            setProduct(response.data.product);
            setIsEditing(false);
        } catch (error) {
            console.log("Error updating product:", error);
        }
    };

    const handleDelete = async () => {
        try {
            setProduct(true)
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
                withCredentials: true,
            });
            navigate("/products");
        } catch (error) {
            console.log("Error deleting product:", error);
        }
    };

    const handleBuyNow = () => {
        setIsCheckingOut(true);
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/buy`,
                {
                    mobile: checkoutDetails.mobile,
                    address: checkoutDetails.address,
                },
                { withCredentials: true }
            );
            navigate("/orders");
        } catch (error) {
            console.log("Error", error);
        }
        setIsCheckingOut(false);
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const isOwner = user && product.created_by === user.id;
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto p-8 mt-20 bg-white mb-25">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 md:mb-40">
                    <div className="relative h-[500px] w-full">
                        <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-full object-fit rounded-lg shadow-lg"
                        />
                    </div>

                    <div className="flex flex-col justify-start space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-black mb-2">
                                {product.product_name}
                            </h1>
                            <p className="text-sm text-gray-600">
                                By {product.manufacturer}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-2xl font-medium text-black mb-4">
                                Original Price : ${product.product_price}
                            </p>
                            <p className="text-3xl font-semibold text-black mb-4">
                                Discounted Price : ${product.product_price - (user.reward_points) / 10}
                            </p>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <p className="text-gray-700 leading-relaxed">
                                Description : {product.product_description}
                            </p>
                        </div>

                        {isOwner ? (
                            <>
                                <button
                                    className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Product
                                </button>
                                <button
                                    className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Product
                                </button>
                            </>
                        ) : (
                            <button
                                className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </button>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <form onSubmit={handleEditSubmit} className="p-6 bg-gray-100 rounded-lg mt-6">
                        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                        <label className="block mb-2">Product Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={editedProduct.product_name}
                            onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
                            required
                        />

                        <label className="block mt-4 mb-2">Product Price</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={editedProduct.product_price}
                            onChange={(e) => setEditedProduct({ ...editedProduct, product_price: e.target.value })}
                            required
                        />

                        <label className="block mt-4 mb-2">Image URL</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={editedProduct.image_url}
                            onChange={(e) => setEditedProduct({ ...editedProduct, image_url: e.target.value })}
                            required
                        />

                        <label className="block mt-4 mb-2">Product Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={editedProduct.product_description}
                            onChange={(e) => setEditedProduct({ ...editedProduct, product_description: e.target.value })}
                            required
                        />

                        <button
                            type="submit"
                            className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete this product?</h2>
                            <div className="flex space-x-4">
                                <button
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isCheckingOut && (
                    <form onSubmit={handleCheckoutSubmit} className="p-6 bg-gray-100 rounded-lg mt-6">
                        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                        <label className="block mb-2">Mobile Number</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={checkoutDetails.mobile}
                            onChange={(e) => setCheckoutDetails({ ...checkoutDetails, mobile: e.target.value })}
                            required
                            name="mobile"
                        />

                        <label className="block mt-4 mb-2">Address</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={checkoutDetails.address}
                            onChange={(e) => setCheckoutDetails({ ...checkoutDetails, address: e.target.value })}
                            required
                            name="address"
                        />

                        <button
                            type="submit"
                            className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                        >
                            Confirm Order
                        </button>
                    </form>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;