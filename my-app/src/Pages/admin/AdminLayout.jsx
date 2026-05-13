import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import axiosinstance from "../../api/apiinstances.js";

function AdminLayout() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  const logout = async () => {

    try {

      await axiosinstance.post("/auth/logout");

      navigate("/login");

    } catch (error) {

      console.error("Logout failed:", error);
    }
  };


  const linkClass = ({ isActive }) =>

    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (

    <div className="h-screen flex bg-gray-100">

      

      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />

      )}

      

      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full
          w-64 bg-slate-900 text-white p-5
          flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

       

        <h2 className="text-2xl font-bold mb-8">
          Admin Panel
        </h2>

        

        <nav className="space-y-2">

          <NavLink
            to="/admin"
            end
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >

            Dashboard

          </NavLink>

          <NavLink
            to="/admin/users"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >

            Users

          </NavLink>

          <NavLink
            to="/admin/products"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >

            Products

          </NavLink>

          <NavLink
            to="/admin/orders"
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >

            Orders

          </NavLink>

        </nav>

        

        <button
          onClick={logout}
          className="mt-auto text-red-400 hover:text-red-600 pt-8 flex items-center gap-2"
        >

          <span>⏻</span>

          <span>Logout</span>

        </button>

      </aside>

      

      <div className="flex-1 flex flex-col w-full">

        

        <header className="md:hidden bg-white shadow p-4 flex items-center justify-between">

          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl font-bold"
          >

            ☰

          </button>

          <h1 className="font-bold text-lg">
            Admin Panel
          </h1>

        </header>

       

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;