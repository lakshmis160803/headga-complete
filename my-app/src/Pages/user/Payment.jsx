import { useState, useEffect } from "react";
import axiosinstance from "../../api/apiinstances.js";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FiTruck, FiCreditCard, FiUser, FiPhone, FiMapPin, FiMail } from "react-icons/fi";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;
  const shippingFromCart = location.state?.shipping || {};

  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState({
    name: shippingFromCart.fullName || "",
    phone: shippingFromCart.phone || "",
    address: shippingFromCart.address || "",
    city: shippingFromCart.city || "",
    state: shippingFromCart.state || "",
    pincode: shippingFromCart.pincode || "",
    email: shippingFromCart.email || ""
  });

  useEffect(() => {
    if (!location.state) {
      toast.error("Cart expired");
      navigate("/cart");
    }
  }, [location.state, navigate]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const validateAccount = () => {
    if (!account.name || !account.phone || !account.address) {
      toast.error("Please fill in the required shipping details");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateAccount()) return;
    try {
      setLoading(true);

      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: Number(item.product.price),
        image: item.product.image
      }));

      const orderPayload = {
        items: orderItems,
        totalAmount: Number(totalAmount),
        status: "placed",
        paymentMethod: "cod",
        paymentStatus: "pending",
        shipping: {
          fullName: account.name,
          phone: account.phone,
          email: account.email,
          address: account.address,
          city: account.city,
          state: account.state,
          pincode: account.pincode
        }
      };

      await axiosinstance.post("/orders", orderPayload, { withCredentials: true });
      await axiosinstance.patch("/cart/clear", {}, { withCredentials: true });

      toast.success("Order placed successfully! 🎧");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const verifyPayment = async (response, orderData) => {
    try {
      await axiosinstance.post(
        "/payment/verify",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderData
        },
        { withCredentials: true }
      );

      await axiosinstance.patch("/cart/clear", {}, { withCredentials: true });

      toast.success("Payment successful! Order placed 🎧");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handlePayment = async () => {
    if (method === "cod") {
      placeOrder();
      return;
    }

    
    if (!validateAccount()) return;

    try {
      setLoading(true);

      const { data: rzpOrder } = await axiosinstance.post(
        "/payment/create-order",
        { amount: totalAmount },
        { withCredentials: true }
      );

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: Number(item.product.price),
          image: item.product.image
        })),
        totalAmount: Number(totalAmount),
        shipping: {
          fullName: account.name,
          phone: account.phone,
          email: account.email,
          address: account.address,
          city: account.city,
          state: account.state,
          pincode: account.pincode
        }
      };

     
      const options = {
       key: "rzp_test_SlyC39i9vNbz9d",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Headphone Store",
        description: "Gadget Purchase",
        order_id: rzpOrder.id,
        handler: async function (response) {
      
          await verifyPayment(response, orderData);
        },
        prefill: {
          name: account.name,
          email: account.email,
          contact: account.phone
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast("Payment cancelled", { icon: "ℹ️" });
          }
        },
        theme: { color: "#0891b2" }
      };

      const rzp = new window.Razorpay(options);

    
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-sm p-8">

       
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h2>
          <p className="text-gray-500 mt-2">Complete your order and start listening.</p>
        </div>

        <div className="space-y-8">

          <section>
            <div className="flex items-center gap-2 mb-4 text-cyan-600 font-semibold uppercase text-xs tracking-widest">
              <FiTruck /> Shipping Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="relative col-span-2">
                <FiUser className="absolute left-4 top-4 text-gray-400" />
                <input
                  name="name"
                  placeholder="Full Name *"
                  value={account.name}
                  onChange={handleAccountChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute left-4 top-4 text-gray-400" />
                <input
                  name="phone"
                  placeholder="Phone *"
                  value={account.phone}
                  onChange={handleAccountChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400" />
                <input
                  name="email"
                  placeholder="Email Address"
                  value={account.email}
                  onChange={handleAccountChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
                />
              </div>

              <div className="relative col-span-2">
                <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  name="address"
                  placeholder="Complete Address *"
                  rows="2"
                  value={account.address}
                  onChange={handleAccountChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
                />
              </div>

              <input
                name="city"
                placeholder="City"
                value={account.city}
                onChange={handleAccountChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={account.pincode}
                onChange={handleAccountChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-cyan-500 focus:bg-white transition-all rounded-xl outline-none"
              />

            </div>
          </section>

          
          <section>
            <div className="flex items-center gap-2 mb-4 text-cyan-600 font-semibold uppercase text-xs tracking-widest">
              <FiCreditCard /> Payment Method
            </div>
            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={() => setMethod("cod")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  method === "cod"
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className={`text-sm font-medium ${method === "cod" ? "text-cyan-600" : "text-gray-600"}`}>
                  Cash on Delivery
                </span>
              </button>

              <button
                onClick={() => setMethod("online")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  method === "online"
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className={`text-sm font-medium ${method === "online" ? "text-cyan-600" : "text-gray-600"}`}>
                  Online Payment
                </span>
              </button>

            </div>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-col items-center sm:flex-row sm:justify-between gap-6">
            <div>
              <p className="text-gray-400 text-sm">Total Amount</p>
              <h3 className="text-3xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</h3>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-200 transition-all active:scale-95 disabled:bg-gray-300 disabled:scale-100"
            >
              {loading ? "Processing..." : method === "cod" ? "Place Order" : "Confirm & Pay"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;