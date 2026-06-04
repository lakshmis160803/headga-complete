import { useEffect, useState } from "react";

import axiosinstance from "../../api/apiinstances.js";

import {
  Package,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Truck,
  Clock,
  Search,
} from "lucide-react";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ─────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await axiosinstance.get("/orders/adminorders");

        setOrders(res.data);

      } catch (err) {

        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();

  }, []);

  // ─────────────────────────────────────
  // UPDATE ORDER STATUS
  // ─────────────────────────────────────

  const updateStatus = async (id, status) => {

    try {

      await axiosinstance.patch(

        `/orders/${id}`,

        { status }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, status }
            : o
        )
      );

    } catch (err) {

      console.error("Failed to update status:", err);
    }
  };

  // ─────────────────────────────────────
  // DELETE ORDER
  // ─────────────────────────────────────

  const deleteOrder = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {

      await axiosinstance.delete(`/orders/${id}`);

      setOrders((prev) =>
        prev.filter((o) => o._id !== id)
      );

    } catch (err) {

      console.error("Failed to delete order:", err);
    }
  };

  // ─────────────────────────────────────
  // FILTER ORDERS
  // ─────────────────────────────────────

  const filteredOrders = orders.filter((o) => {

    const search = searchTerm.toLowerCase();

    const orderIdMatch =
      o._id?.toLowerCase().includes(search);

    const userNameMatch =
      (
        typeof o.user === "object"
          ? o.user?.name || o.user?.email
          : o.user
      )
        ?.toLowerCase()
        .includes(search);

    return orderIdMatch || userNameMatch;
  });

  return (

    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-800">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">

          <div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Order Management
            </h1>

            <p className="text-slate-500 mt-1">
              View and manage customer fulfillment status.
            </p>

          </div>

          {/* SEARCH */}

          <div className="relative group">

            {/* <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            /> */}

            {/* <input
              type="text"
              placeholder="Search by ID or User..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-72 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-slate-50/50 border-b border-slate-200">

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order Details
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredOrders.map((order) => (

                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >

                    {/* ORDER DETAILS */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">

                          <Package size={20} />

                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-900 leading-tight">

                            #{order._id.slice(-8).toUpperCase()}

                          </p>

                          <p className="text-xs text-slate-400 mt-1">

                            ID: {order._id}

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">

                      <p className="text-sm font-semibold text-slate-700">

                        {typeof order.user === "object"
  ? order.user?.name || order.user?.email || "Google-User"
  : "Deleted User"}

                      </p>

                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-5 text-center font-bold text-slate-900">

                      ₹{order.totalAmount?.toLocaleString()}

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <div className="flex justify-center">

                        <StatusBadge
                          status={order.status}
                          onChange={(newStatus) =>
                            updateStatus(order._id, newStatus)
                          }
                        />

                      </div>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5 text-right">

                      <div className="flex justify-end gap-2">

                     

                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Order"
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* EMPTY STATE */}

          {filteredOrders.length === 0 && (

            <div className="py-20 flex flex-col items-center justify-center text-slate-400">

              <Package
                size={48}
                strokeWidth={1}
                className="mb-4"
              />

              <p className="text-lg font-medium">
                No orders found matching your search
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/* STATUS BADGE */

function StatusBadge({ status, onChange }) {

  const configs = {

    placed: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={14} />,
    },

    shipped: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Truck size={14} />,
    },

    delivered: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={14} />,
    },
  };

  const current = configs[status] || configs.placed;

  return (

    <div
      className={`flex items-center gap-2 px-2 py-1 rounded-full border ${current.color} transition-all`}
    >

      <span className="pl-1">
        {current.icon}
      </span>

      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs font-bold uppercase tracking-wide outline-none cursor-pointer pr-1"
      >

        <option value="placed">
          Placed
        </option>

        <option value="shipped">
          Shipped
        </option>

        <option value="delivered">
          Delivered
        </option>

      </select>

    </div>
  );
}