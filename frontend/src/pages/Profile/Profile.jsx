import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout, setUser } = useAuth(); 

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });
      setUser(res.data.user); 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();  
  }, []);  
  

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 py-5">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm mb-10 md:mb-50.5">
          <div className="relative h-48 bg-black rounded-t-lg">
            <div className="absolute -bottom-16 left-8">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-900">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Reward Points</p>
                    <p className="font-medium text-gray-900">{user?.reward_points}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium text-gray-900">
                      {user?.role === "Admin" ? 'Admin Account' : 'General Account'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors hover:cursor-pointer">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer">
                  View Activity
                </button>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <button
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors hover:cursor-pointer"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
