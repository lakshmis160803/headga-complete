import { useEffect, useState } from "react";
import axiosinstance from "../../api/apiinstances.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

import { Users, ShoppingBag, Package, IndianRupee, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
  const [chartData30, setChartData30] = useState([]);
  const [chartData7, setChartData7] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [range, setRange] = useState("30");

  useEffect(() => {
    axiosinstance
      .get("/admin/stats", { withCredentials: true })
      .then(res => {
        const data = res.data;
        setStats({
          users: data.users,
          orders: data.orders.length,
          products: data.products
        });
        setTotalRevenue(data.totalRevenue);
        prepareChartData(data.orders, 30, setChartData30);
        prepareChartData(data.orders, 7, setChartData7);
      })
      .catch(err => console.error("Error fetching stats", err));
  }, []);


  const prepareChartData = (orders, days, setter) => {
    const dates = [...Array(days)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const revenueByDate = {};
    orders.forEach(o => {
      if (!o.createdAt) return;
      const date = o.createdAt.split("T")[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + (o.totalAmount || 0);
    });

    const data = dates.reverse().map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revenueByDate[date] || 0
    }));

    setter(data);
  };

  const chartToShow = range === "7" ? chartData7 : chartData30;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 text-slate-900">
   
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setRange("30")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              range === "30" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setRange("7")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              range === "7" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Last 7 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value={stats.users} icon={<Users size={20}/>} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Orders" value={stats.orders} icon={<ShoppingBag size={20}/>} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Products" value={stats.products} icon={<Package size={20}/>} color="text-violet-600" bg="bg-violet-50" />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee size={20}/>} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
            <TrendingUp size={20} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-bold">Revenue Analytics</h2>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartToShow}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0f172a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}