import { useEffect, useState } from "react";
import axiosinstance from "../../api/apiinstances.js";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
 useEffect(() => {
  axiosinstance
    .get("/orders", {
      withCredentials: true
    })
    .then(res => {
      setOrders(res.data.reverse());
    })
    .catch(err => {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    });
}, [navigate]);

  

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>

        {orders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow">
            <p className="text-gray-500 text-lg">
              You have no orders yet 📦
            </p>
          </div>
        )}

        <div className="space-y-8">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
             
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">#{order._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === "placed"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

            
              {order.items?.length > 0 && (
                <div className="space-y-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border-b pb-4 last:border-0"
                    >
                     <img
  src={item.product?.image}
  alt={item.product?.title}
  className="w-20 h-20 object-cover rounded-lg border"
/>

                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product?.title}</h4>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              
              {order.shipping && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Shipping Details</h4>
                  <p>{order.shipping.fullName}</p>
                  <p>{order.shipping.phone}</p>
                  <p>{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state} -{" "}
                    {order.shipping.pincode}
                  </p>
                </div>
              )}

             
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-xl font-bold">
                  ₹{order.totalAmount}   
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
