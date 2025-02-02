import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.log("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
    );

    const addToCart = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products/cart/${id}` , {id} , {withCredentials:true})
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching product:", error);
        }
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto p-8 mt-20 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 md:mb-40">
                    <div className="relative h-[500px] w-full">
                        <img
                            src={product.imageUrl}
                            alt={product.product_name}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
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
                            <p className="text-3xl font-bold text-black mb-4">
                                ${product.product_price}
                            </p>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <p className="text-gray-700 leading-relaxed">
                                {product.product_description}
                            </p>
                        </div>

                        <button className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 hover:cursor-pointer"
                            onClick={addToCart}

                        >
                            Add to Cart
                        </button>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>✓</span>
                                <span>Free shipping on orders over $100</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                                <span>✓</span>
                                <span>30-day return policy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;