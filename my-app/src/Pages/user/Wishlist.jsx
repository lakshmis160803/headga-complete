import { useWishlist } from "./Wishlistcontext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import axiosinstance from "../../api/apiinstances.js";

function Wishlist() {
  const { wishlist, toggleWishlist, userId, loading } = useWishlist();

  const addToCart = async (product) => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      await axiosinstance.post(
        "/cart",
        { productId: product._id },
        { withCredentials: true }
      );
      toast.success("Added to cart");
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10">Loading...</p>
      </div>
    );
  }


  if (!userId) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10 text-red-500">
          Please login first
        </p>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="h-screen overflow-y-auto">
        <Navbar />
        <p className="text-center mt-10 text-lg font-medium">
          No items in wishlist 💔
        </p>
      </div>
    );
  }


  return (
    <div className="h-screen overflow-y-auto">
      <Navbar />
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">My Wishlist ❤️</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(item => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4"
              >
                <Link to={`/productui/${product._id}`}>
                  <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl">
                    <img
                      src={product.image}
                      alt={product.description}
                      className="h-40 object-contain"
                    />
                  </div>
                </Link>

                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </p>

                  <span className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-50"
                    >
                      Remove
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;