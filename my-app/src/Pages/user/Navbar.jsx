import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useWishlist } from "./WishlistContext.jsx";


export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [cartCount, setCartCount] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

  const wishlistCount = wishlist.length;
  const handleLogout = () => logout(navigate);

  return (
    <div className="sticky top-0 z-50 bg-white shadow">
    
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          HEADGA
        </h1>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate("/")} className="hover:text-blue-600 text-lg">Home</button>
          <button onClick={() => navigate("/productdetails")} className="hover:text-blue-600 text-lg">Products</button>

          <button onClick={() => navigate("/wishlist")} className="relative text-2xl">
            ❤️
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate("/cart")} className="relative text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate("/orders")} className="hover:text-blue-600 text-lg">Orders</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user.name ? (
            <>
              <span className="font-medium"><span className="font-bold">{user.name}</span></span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-1 rounded">Login</button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpenMenu(!openMenu)} className="text-3xl">☰</button>
        </div>
      </div>

      {openMenu && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 shadow">
          <button onClick={() => { navigate("/"); setOpenMenu(false); }} className="block w-full text-left">Home</button>
          <button onClick={() => { navigate("/productdetails"); setOpenMenu(false); }} className="block w-full text-left">Products</button>
          <button onClick={() => { navigate("/wishlist"); setOpenMenu(false); }} className="block w-full text-left">❤️ Wishlist ({wishlistCount})</button>
          <button onClick={() => { navigate("/cart"); setOpenMenu(false); }} className="block w-full text-left">🛒 Cart ({cartCount})</button>
          <button onClick={() => { navigate("/order"); setOpenMenu(false); }} className="block w-full text-left">Orders</button>

          {user.name ? (
            <>
              <div className="font-bold">{user.name}</div>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded w-full">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
          )}
        </div>
      )}
    </div>
  );
}