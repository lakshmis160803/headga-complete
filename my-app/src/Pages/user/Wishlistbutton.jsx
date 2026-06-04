import { useWishlist } from "./WishlistContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function WishlistButton({ product }) {
  const { toggleWishlist, isInWishlist, userId,loading } = useWishlist();
  const active = isInWishlist(product._id);
  const navigate = useNavigate();


 const handleClick = () => {
  if (loading) return; 

  if (!userId) {
    toast.error("Please login to add to wishlist");
    navigate("/login");
    return;
  }

  toggleWishlist(product);
};

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center justify-center 
        w-10 h-10 rounded-full transition-all duration-300
        ${active ? "bg-red-500 scale-110" : "bg-white"}
        shadow hover:scale-110
        ${!userId ? "opacity-50 cursor-not-allowed" : ""}`} 
    >
      <span
        className={`text-xl transition-all duration-300
          ${active ? "text-white animate-heartPop" : "text-gray-400"}`}
      >
        ❤️
      </span>

      {active && (
        <span className="absolute inline-flex h-full w-full rounded-full 
          bg-red-400 opacity-75 animate-ping" />
      )}
    </button>
  );
}

export default WishlistButton;