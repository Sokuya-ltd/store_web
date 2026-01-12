import Card from "../components/ui/Card";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Clock, PoundSterlingIcon, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  // Revenue data for chart
  const revenueData = [
    { day: "Mon", revenue: 2000 },
    { day: "Tue", revenue: 2800 },
    { day: "Wed", revenue: 1800 },
    { day: "Thu", revenue: 3200 },
    { day: "Fri", revenue: 4100 },
    { day: "Sat", revenue: 3800 },
    { day: "Sun", revenue: 4500 },
  ];

  // Stats data with icons and trends
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,450.00",
      change: "+12.5%",
      trend: "up",
      icon: PoundSterlingIcon,
      iconColor: "text-[#D35400]",
    },
    {
      label: "Active Orders",
      change: "+4",
      trend: "up",
      value: "+24",
      subtext: "since last hour",
      icon: ShoppingCart,
      iconColor: "text-[#556B2F]",
    },
    {
      label: "Low Stock Items",
      value: "7",
      subtext: "Requires attention",
      icon: Package,
      iconColor: "text-[#D35400]",
    },
    {
      label: "Total Customers",
      value: "1,203",
      change: "+4.8%",
      trend: "up",
      subtext: "new this week",
      icon: PoundSterlingIcon,
      iconColor: "text-[#556B2F]",
    },
  ];

  const recentOrders = [
    { 
      id: 1, 
      customer: "Alice Freeman", 
      initials: "A",
      amount: "$45.00",
      time: "5m ago",
      status: "Preparing",
      statusBg: "bg-blue-100",
      statusText: "text-blue-700"
    },
    { 
      id: 2, 
      customer: "Bob Smith", 
      initials: "B",
      amount: "$12.50",
      time: "12m ago",
      status: "Ready",
      statusBg: "bg-[#556B2F]/10",
      statusText: "text-[#556B2F]"
    },
    { 
      id: 3, 
      customer: "Charlie Brown", 
      initials: "C",
      amount: "$124.00",
      time: "1h ago",
      status: "Delivered",
      statusBg: "bg-gray-100",
      statusText: "text-gray-700"
    },
    { 
      id: 4, 
      customer: "Diana Prince", 
      initials: "D",
      amount: "$28.00",
      time: "1h ago",
      status: "Pending",
      statusBg: "bg-[#D35400]/10",
      statusText: "text-[#D35400]"
    },
  ];

  return (
    <div className="w-full space-y-8 px-6 py-6">
      {/* Hero Welcome Card */}
      <div className="bg-linear-to-br from-[#D35400] to-[#A04000] p-12 text-white shadow-lg rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4">Welcome back, Sokuya Store!</h2>
            <p className="text-orange-100 mb-8">You have 4 new orders to prepare and 2 low stock alerts.</p>
            <div className="flex gap-4">
              <button className="bg-white text-[#D35400] px-8 py-3 font-semibold hover:bg-orange-50 transition">
                Manage Orders
              </button>
              <button className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white/10 transition">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - 4 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
            const gradients = [
            "bg-gradient-to-br from-blue-50 to-blue-100",
            "bg-gradient-to-br from-green-50 to-green-100",
            "bg-gradient-to-br from-orange-50 to-orange-100",
            "bg-gradient-to-br from-purple-50 to-purple-100",
            ];

            return (
            <Card key={stat.label} className={`p-8 rounded-lg ${gradients[stats.indexOf(stat)]}`}>
              <div className="flex items-start justify-between mb-6">
              <div className={`p-4 bg-black/5 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                </div>
              )}
              </div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              {stat.subtext && <p className="text-xs text-slate-500">{stat.subtext}</p>}
            </Card>
            );
        })}
      </div>

      {/* Revenue Overview and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-8 rounded-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Daily revenue for the past week</p>
            </div>
            <button className="text-sm text-[#D35400] hover:text-[#A04000] font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#D35400" 
                strokeWidth={3}
                dot={{ fill: '#D35400', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Orders */}
        <Card className="p-8 rounded-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">Recent Orders</h3>
              <p className="text-sm text-slate-500">You have 4 active orders</p>
            </div>
          </div>
          <div className="space-y-6">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#D35400]/10 flex items-center justify-center font-semibold text-[#D35400]">
                    {order.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 text-sm mb-2">{order.amount}</p>
                  <span className={`inline-block px-3 py-2 text-xs font-medium ${order.statusBg} ${order.statusText}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 text-center text-[#D35400] hover:text-[#A04000] font-semibold text-sm py-2">
            View All Orders →
          </button>
        </Card>
      </div>
    </div>
  );
}
