import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductLayout from '../../components/Products/ProductLayout';
import { useAuth } from '../../Context/AuthContext';

const Combo = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComboProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          { withCredentials: true }
        );
        const comboProducts = response.data.products.filter((product) => product.combo === true);
        setProducts(comboProducts);
      } catch (error) {
        console.error('Error fetching combo offer products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComboProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-center mb-8">Combo Offer Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">No combo offers available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductLayout
                key={product.product_id}
                product_id={product.product_id}
                productName={product.product_name}
                imageUrl={product.image_url}
                productDescription={product.product_description}
                manufacturer={product.manufacturer}
                productPrice={product.product_price - user.reward_points / 10}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Combo;
