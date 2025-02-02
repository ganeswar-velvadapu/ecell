import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import axios from 'axios'

const OrderRequest = () => {


    const [loading, setLoading] = useState(true)
    const [requests, setOrderRequests] = useState([])

    useEffect(() => {
        const fetchOrderRequests = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/orders/requests`, { withCredentials: true })
                setOrderRequests(response.data.requests)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }

        }
        fetchOrderRequests()
    }, [])

    return (
        <div>
            <Navbar />
            <div className="bg-white text-black mb-30 p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">My Orders Requests</h1>

                {loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <p className="text-center text-gray-400">No Requests found.</p>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request.order_id} className="bg-gray-200 border border-gray-700 rounded-lg shadow-md">
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold">{request.product_name}</h2>
                                        <p className="text-gray-400">Price: ${request.price}</p>
                                        <p className="text-gray-400 text-sm">Deliver to: {request.address}</p>
                                        <p className="text-gray-400 text-sm">Mobile: {request.mobile}</p>
                                        <p className="text-gray-400 text-sm">Buyer Email: {request.buyer_email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default OrderRequest