import React, { useState } from 'react'
import {Link} from "react-router-dom"
import { useAuth } from '../../Context/AuthContext'

const Login = () => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const {login} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        await login(email, password);
        setLoading(false)
      };

    

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                            name='email'
                            onChange={(e)=> setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                            name='password'
                            onChange={(e)=> setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition hover:cursor-pointer"
                    >
                        {
                            loading ? "loading.." : "Loading"
                        }
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-black hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login