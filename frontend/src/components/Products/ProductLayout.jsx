import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const ProductLayout = ({ productName, imageUrl, productDescription, manufacturer, productPrice,product_id }) => {

    const navigate = useNavigate()
     

    return (
        <div
            onClick={() => navigate(`/products/${product_id}`) }

            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition duration-300 hover:cursor-pointer"
        >
            <img
                src={imageUrl}
                alt={productName}
                className="w-full h-[200px] md:h-[300px] object-fit"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{productName}</h3>
                <p className="text-gray-600 mt-2">{productDescription}</p>
                <p className="text-lg font-bold text-black   mt-3">${productPrice}</p>
                <p className="text-sm text-gray-500 mt-1">Manufacturer: {manufacturer}</p>
            </div>
        </div>
    )
}

export default ProductLayout