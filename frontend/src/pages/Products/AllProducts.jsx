import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductLayout from '../../components/Products/ProductLayout';
import { useAuth } from '../../Context/AuthContext';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const {user} = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const fetchedProducts = response.data.products;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);

        const uniqueCompanies = [
          ...new Set(fetchedProducts.map((product) => product.manufacturer)),
        ];
        setCompanies(uniqueCompanies);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCompanies((prevSelectedCompanies) => {
      if (checked) {
        return [...prevSelectedCompanies, value];
      } else {
        return prevSelectedCompanies.filter((company) => company !== value);
      }
    });
  };

  useEffect(() => {
    if (selectedCompanies.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        selectedCompanies.includes(product.manufacturer)
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCompanies, products]);

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
      <div className="flex">
        <div className="w-1/4 p-6">
          <h3 className="text-lg font-semibold mb-4">Filter by Company</h3>
          <div className="space-y-2">
            {companies.map((company) => (
              <div key={company} className="flex items-center">
                <input
                  type="checkbox"
                  value={company}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label>{company}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-3/4 p-6">
          <h2 className="text-3xl font-semibold text-center mb-8">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductLayout
                key={product.product_id}
                product_id={product.product_id}
                productName={product.product_name}
                imageUrl={product.image_url}
                productDescription={product.product_description}
                manufacturer={product.manufacturer}
                productPrice={product.product_price - (user.reward_points)/10}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProducts;
