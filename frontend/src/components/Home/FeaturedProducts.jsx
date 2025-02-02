import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductLayout from '../../components/Products/ProductLayout'

const FeaturedProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
                setProducts(response.data.products.slice(0, 10))
                setLoading(false)
            } catch (error) {
                console.log('Error fetching products:', error)
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        )
    }

    return (
        <div className='p-6'>
            <h1 className='font-bold mt-4 mb-4 text-4xl'>Featured Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductLayout
                        key={product.product_id}
                        productName={product.product_name}
                        imageUrl={product.image_url}
                        productDescription={product.product_description}
                        manufacturer={product.manufacturer}
                        productPrice={product.product_price}
                        product_id={product.product_id}
                    />
                ))}
            </div>
        </div>
    )
}

export default FeaturedProducts
