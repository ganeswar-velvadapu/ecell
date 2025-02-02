import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth()

  console.log(user)

  const isAdmin = user?.role == "Admin";

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Logo
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/products" className="hover:text-blue-600">
            Our Products
          </Link>
          <Link to="/combos" className="hover:text-blue-600">
            Combos
          </Link>
          <Link to="/cart" className="hover:text-blue-600 flex items-center">
            <FiShoppingCart className="mr-1" /> Cart
          </Link>
          <Link to="/profile" className="hover:text-blue-600 flex items-center">
            <FiUser className="mr-1" /> Profile
          </Link>
          { isAdmin &&
            <Link to="/add/product" className="hover:text-blue-600 flex items-center">
              <FiUser className="mr-1" /> Add Product
            </Link>
          }
        </div>


        <button className="md:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>


      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link to="/products" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Our Products
            </Link>
            <Link to="/combos" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Combos
            </Link>
            <Link to="/cart" className="hover:text-blue-600 flex items-center" onClick={() => setIsOpen(false)}>
              <FiShoppingCart className="mr-1" /> Cart
            </Link>
            <Link to="/profile" className="hover:text-blue-600 flex items-center" onClick={() => setIsOpen(false)}>
              <FiUser className="mr-1" /> Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
