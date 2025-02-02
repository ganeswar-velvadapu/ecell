import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductLayout from '../../components/Products/ProductLayout';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        setProducts(response.data.products);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  }


  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold text-center mb-8">All Products</h2>

        {
          loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
              {products.map((product) => (
                <ProductLayout
                  key={product.product_id}
                  product_id={product.product_id}
                  productName={product.product_name}
                  imageUrl={product.image_url}
                  productDescription={product.product_description}
                  manufacturer={product.manufacturer}
                  productPrice={product.product_price}
                />
              ))
              }
            </div>
          )
        }

      </div>
      <Footer />
    </div>
  );
};

export default AllProducts;
