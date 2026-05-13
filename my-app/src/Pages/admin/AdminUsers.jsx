import { useEffect, useState } from "react";

import axiosinstance from "../../api/apiinstances.js";

import {
  Users,
  Search,
  Shield,
  MoreHorizontal,
  UserX,
  UserCheck,
  Trash2,
  Mail,
  Filter,
} from "lucide-react";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("all");

  

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const res = await axiosinstance.get("/admin/users");

        setUsers(res.data);

      } catch (err) {

        console.error("Fetch error:", err);
      }
    };

    fetchUsers();

  }, []);

  

  const toggleBlock = async (user) => {

    try {

      await axiosinstance.patch(

        `/admin/users/${user._id}`,

        {
          blocked: !user.blocked,
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, blocked: !u.blocked }
            : u
        )
      );

    } catch (err) {

      console.error("Toggle block error:", err);
    }
  };

  
  const filteredUsers = users.filter((u) => {

    const matchesSearch =

      u.name.toLowerCase().includes(search.toLowerCase()) ||

      u.email.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "blocked") {

      return matchesSearch && u.blocked;
    }

    if (activeTab === "admins") {

      return matchesSearch && u.role === "admin";
    }

    return matchesSearch;
  });

  const deleteUser = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {

    await axiosinstance.delete(
      `/admin/users/${id}`
    );

    setUsers((prev) =>
      prev.filter((u) => u._id !== id)
    );

  } catch (err) {

    console.error("Delete error:", err);
  }
};

  return (

    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans text-slate-900">

      <div className="max-w-6xl mx-auto">

        

        <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 mb-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>

              <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">

                <Users
                  className="text-indigo-600"
                  size={28}
                />

                User Directory

              </h1>

              <p className="text-slate-500 text-sm">

                Manage access control and account status

              </p>

            </div>

           

            <div className="flex items-center gap-3 w-full md:w-auto">

              <div className="relative flex-grow">

                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              {/* <button className="p-2 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm">

                <Filter size={20} />

              </button> */}

            </div>

          </div>

         

          <div className="flex gap-6 mt-8 border-b border-slate-100">

            {["all", "admins", "blocked"].map((tab) => (

              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold capitalize transition-all relative ${
                  activeTab === tab
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >

                {tab}

                {activeTab === tab && (

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />

                )}

              </button>
            ))}

          </div>

        </div>

      
        <div className="bg-white/70 backdrop-blur-sm border border-white rounded-[2rem] shadow-2xl shadow-slate-200/40 overflow-hidden">

          <table className="w-full border-collapse">

            <thead>

              <tr className="text-left text-slate-400 text-xs uppercase tracking-[0.1em] font-black">

                <th className="px-8 py-5 border-b border-slate-50">
                  Member
                </th>

                <th className="px-6 py-5 border-b border-slate-50">
                  Access Level
                </th>

                <th className="px-6 py-5 border-b border-slate-50">
                  Status
                </th>

                <th className="px-8 py-5 border-b border-slate-50 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-50">

              {filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="group hover:bg-white transition-all"
                >

                  

                  <td className="px-8 py-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">

                        {user.name?.charAt(0).toUpperCase()}

                      </div>

                      <div>

                        <p className="font-bold text-slate-800">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400 flex items-center gap-1">

                          <Mail size={12} />

                          {user.email}

                        </p>

                      </div>

                    </div>

                  </td>

                  

                  <td className="px-6 py-4">

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border ${
                        user.role === "admin"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}
                    >

                      <Shield size={12} />

                      {user.role}

                    </div>

                  </td>

                  
                  <td className="px-6 py-4">

                    <div
                      className={`flex items-center gap-2 text-xs font-bold ${
                        user.blocked
                          ? "text-rose-500"
                          : "text-emerald-500"
                      }`}
                    >

                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          user.blocked
                            ? "bg-rose-500"
                            : "bg-emerald-500"
                        }`}
                      />

                      {user.blocked ? "Blocked" : "Active"}

                    </div>

                  </td>


                  <td className="px-8 py-4">

                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">

                      {user.role !== "admin" && (

                        <>

                          <button
                            onClick={() => toggleBlock(user)}
                            className={`p-2 rounded-xl transition-colors border ${
                              user.blocked
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                            }`}
                          >

                            {user.blocked
                              ? <UserCheck size={18} />
                              : <UserX size={18} />}

                          </button>

                          <button 
                          onClick={()=>deleteUser(user._id)}
                          className="p-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors">

                            <Trash2 size={18} />

                          </button>

                        </>
                      )}

                      {/* <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">

                        <MoreHorizontal size={18} />

                      </button> */}

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          

          {filteredUsers.length === 0 && (

            <div className="p-20 text-center">

              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">

                <Users className="text-slate-300" />

              </div>

              <p className="text-slate-400 font-medium">

                No members found in this category.

              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}