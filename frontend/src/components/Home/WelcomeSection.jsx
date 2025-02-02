import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeSection = () => {
    return (
        <section
            className="relative bg-cover bg-center h-screen"
            style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1672883551967-ab11316526b4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white">

                <h1 className="text-4xl md:text-5xl font-semibold mb-4">
                    Welcome to Our Store!
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                    Discover the best products and exclusive deals. Shop now to grab the latest items!
                </p>
                <Link
                    to="/products"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors hover:cursor-pointer"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
};

export default WelcomeSection;
