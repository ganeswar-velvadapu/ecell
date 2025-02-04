import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    manufacturer: '',
    imageUrl: '',
    isComboOffer: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [apiError, setApiError] = useState(""); 

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.productDescription.trim()) newErrors.productDescription = 'Product description is required';
    
    if (!formData.productPrice.trim()) {
      newErrors.productPrice = 'Price is required';
    } else if (isNaN(formData.productPrice) || parseFloat(formData.productPrice) <= 0) {
      newErrors.productPrice = 'Please enter a valid price';
    }
    
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+\/.+$/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        withCredentials: true
      });

        navigate("/products"); 
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-20 mb-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h2>

        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Product Name", name: "productName", type: "text" },
            { label: "Product Description", name: "productDescription", type: "textarea", rows: 4 },
            { label: "Price ($)", name: "productPrice", type: "text" },
            { label: "Manufacturer", name: "manufacturer", type: "text" },
            { label: "Image URL", name: "imageUrl", type: "text" }
          ].map(({ label, name, type, rows }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  rows={rows}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:ring-black`}
                />
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 border ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:ring-black`}
                />
              )}
              {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
            </div>
          ))}

          {/* Combo Offer Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isComboOffer"
              name="isComboOffer"
              checked={formData.isComboOffer}
              onChange={handleChange}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="isComboOffer" className="text-sm font-medium text-gray-700">
              Is it a combo offer?
            </label>
          </div>

          {formData.imageUrl && (
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Image Preview</p>
              <img
                src={formData.imageUrl}
                alt="Product preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  e.target.src = '/api/placeholder/200/200';
                  e.target.alt = 'Preview not available';
                }}
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
