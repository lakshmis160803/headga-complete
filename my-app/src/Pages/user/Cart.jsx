import { useEffect, useState, useMemo } from "react";
import axiosinstance from "../../api/apiinstances.js";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true); 
  const navigate=useNavigate()
useEffect(() => {
  const fetchCart = async () => {
    try {
      const res = await axiosinstance.get(
        "/cart",
        { withCredentials: true }
      );

      setCart(res.data || { items: [] });

    } catch (err) {
      console.error("CART FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);

  const increaseQty = async (item) => {
    try {
      const res = await axiosinstance.patch("/cart/update", {
        cartId: cart._id,
        productId: item.product._id,
        action: "inc",
      },{withCredentials:true});
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (item) => {
    try {
      const res = await axiosinstance.patch("/cart/update", {
        cartId: cart._id,
        productId: item.product._id,
        action: "dec"
      },{withCredentials:true});
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (item) => {
    try {
      const res = await axiosinstance.patch("/cart/remove", {
        cartId: cart._id,
        productId: item.product._id
      },{withCredentials:true});
      setCart(res.data);
    } catch (err) {
      console.error("REMOVE ERROR:", err.response?.data || err.message);
    }
  };

  const grandTotal = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity, 0
    );
  }, [cart]);


  if (loading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-gray-500 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-gray-500 text-lg">Your cart is empty 🛒</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold">Shopping Cart</h2>

          {cart.items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition flex gap-6 p-5">
              <img src={item.product?.image} alt={item.product?.title} className="w-28 h-28 object-cover rounded-xl border" />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-1">{item.product?.title}</h3>
                  <p className="text-gray-500 mt-1">₹{item.product?.price}</p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => decreaseQty(item)} disabled={item.quantity === 1} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-40">-</button>
                  <span className="font-semibold text-lg w-6 text-center">{item.quantity}</span>
                  <button onClick={() => increaseQty(item)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">+</button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="text-lg font-bold">₹{item.product?.price * item.quantity}</p>
                <button onClick={() => removeItem(item)} className="text-red-500 text-sm hover:underline mt-2">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

          <div className="flex justify-between text-gray-600 mb-3">
            <span>Items ({cart.items.length})</span>
            <span>₹{grandTotal}</span>
          </div>

          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          <button
            onClick={() => navigate("/payment", { state: { cartItems: cart.items, totalAmount: grandTotal } })}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;