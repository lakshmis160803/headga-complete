import { createContext, useContext, useEffect, useState } from "react";
import axiosinstance from "../../api/apiinstances.js";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);

  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  
  const fetchWishlist = async () => {

    try {

      const res = await axiosinstance.get(
        "/wishlist"
      );

      setWishlist(res.data);

    } catch (err) {

      console.error(
        "FETCH WISHLIST ERROR:",
        err.response?.data || err.message
      );
    }
  };


  useEffect(() => {

    axiosinstance
      .get("/auth/me")

      .then((res) => {

        setUserId(res.data.id);
      })

      .catch(() => {

        setUserId(null);
      })

      .finally(() => {

        setLoading(false);
      });

  }, []);

  useEffect(() => {

    if (!userId) {

      setWishlist([]);

      return;
    }

    fetchWishlist();

  }, [userId]);

  const toggleWishlist = async (product) => {

    if (!userId) {

      toast.error(
        "Please login to use wishlist"
      );

      return;
    }

    try {

      const existing = wishlist.find(
        (item) =>
          item.product._id === product._id
      );

      if (existing) {

        await axiosinstance.delete(
          `/wishlist/${existing._id}`
        );

        toast.error(
          "Removed from wishlist"
        );

      }

      else {

        await axiosinstance.post(
          "/wishlist",
          {
            productId: product._id,
          }
        );

        toast.success(
          "Added to wishlist"
        );
      }

      fetchWishlist();

    } catch (err) {

      console.error(
        "WISHLIST ERROR:",
        err.response?.data || err.message
      );

      if (
        err.response?.status === 401
      ) {

        toast.error(
          "Session expired. Please login again"
        );

        setUserId(null);

        setWishlist([]);

      } else {

        toast.error(
          "Wishlist failed"
        );
      }
    }
  };

  const isInWishlist = (id) => {

    return wishlist.some(
      (item) => item.product._id === id
    );
  };

  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        setUserId,
        userId,
        loading,
      }}
    >

      {children}

    </WishlistContext.Provider>
  );
};

export const useWishlist = () =>
  useContext(WishlistContext);