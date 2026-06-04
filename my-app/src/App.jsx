import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Pages/user/Login";
import Home from "./Pages/user/Home";
import ProductDetails from "./Pages/user/ProductDetails";
import Productui from "./Pages/user/Productui";
import Cart from "./Pages/user/Cart";
import Wishlist from "./Pages/user/Wishlist";
import Orders from "./Pages/user/Order";
import Payment from "./Pages/user/Payment";

import AdminRoute from "./Pages/admin/AdminRoute";

import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminOrders from "./Pages/admin/AdminOrders";
import Profile from "./Pages/user/Profile";



function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          
          <Route path="/login" element={<Login />} />

         
          <Route path="/" element={<Home />} />
          <Route path="/productdetails" element={<ProductDetails />} />
          <Route path="/productui/:id" element={<Productui />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
         

          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >          
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
