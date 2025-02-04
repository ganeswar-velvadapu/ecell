import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import { AuthProvider } from './Context/AuthContext'
import RedirectIfAuthenticated from './RedirectIfAuthenticated.jsx'
import ProtectedRoute from './ProtectRoute.jsx'
import AllProducts from './pages/Products/AllProducts.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx'
import Profile from './pages/Profile/Profile.jsx'
import AddProduct from './pages/Products/AddProduct.jsx'
import MyOrders from './pages/Products/MyOrders.jsx'
import OrderRequest from './pages/Products/OrderRequest.jsx'
import Combos from './pages/Combos/Combos.jsx'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/signup" element={<RedirectIfAuthenticated><SignUp /></RedirectIfAuthenticated>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />

            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <AllProducts/>
            </ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetails/>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          } />
          <Route path="/add/product" element={
            <ProtectedRoute>
              <AddProduct/>
            </ProtectedRoute>
          } />
           <Route path="/orders" element={
            <ProtectedRoute>
              <MyOrders/>
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <OrderRequest/>
            </ProtectedRoute>
          } />
          <Route path="/combos" element={
            <ProtectedRoute>
              <Combos/>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
