import Card from "../components/ui/Card";
import { TrendingUp, TrendingDown, ShoppingCart, Package, PoundSterlingIcon, ArrowRight } from "lucide-react";

const STATUS_STYLES = {
  Preparing: "bg-orange-400/20 text-orange-300",
  Ready: "bg-green-400/20 text-green-300",
  Delivered: "bg-neutral-500/20 text-neutral-400",
};
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
    { label: "Total Revenue", value: "£12,450.00", change: "+12.5%", trend: "up", icon: PoundSterlingIcon },
    { label: "Active Orders", value: "24", change: "+4", trend: "up", subtext: "since last hour", icon: ShoppingCart },
    { label: "Low Stock Items", value: "7", subtext: "Requires attention", icon: Package },
    { label: "Total Customers", value: "1,203", change: "+4.8%", trend: "up", subtext: "new this week", icon: PoundSterlingIcon },
  ];

  const recentOrders = [
    { id: 1, customer: "Alice Freeman", initials: "A", amount: "£45.00", time: "5m ago", status: "Preparing" },
    { id: 2, customer: "Bob Smith", initials: "B", amount: "£12.50", time: "12m ago", status: "Ready" },
    { id: 3, customer: "Charlie Brown", initials: "C", amount: "£124.00", time: "1h ago", status: "Delivered" },
  ];

  return (
    <div className="w-full space-y-8 px-6 py-6">
      {/* Hero Welcome Card */}
      <div className="p-10 text-white shadow-2xl rounded-xl bg-linear-to-br from-orange-500 to-orange-600 animate-fade-in">
        <h2 className="text-3xl font-bold mb-3">Welcome back, Sokuya Store!</h2>
        <p className="text-white/80 mb-7">You have 4 new orders to prepare and 2 low stock alerts.</p>
        <div className="flex gap-4">
          <button className="bg-white text-orange-500 px-7 py-2.5 font-semibold hover:bg-orange-50 hover:scale-105 transition-all duration-200 rounded-lg text-sm">
            Manage Orders
          </button>
          <button className="border-2 border-white text-white px-7 py-2.5 font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-200 rounded-lg text-sm">
            View Reports
          </button>
        </div>
      </div>

      {/* Stats Cards - 4 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 rounded-xl animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-400/15 rounded-lg">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1">
                    {stat.trend === "up"
                      ? <TrendingUp className="w-4 h-4 text-green-400" />
                      : <TrendingDown className="w-4 h-4 text-red-400" />
                    }
                    <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-neutral-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              {stat.subtext && <p className="text-xs text-neutral-500">{stat.subtext}</p>}
            </Card>
          );
        })}
      </div>

      {/* Revenue Overview and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6 rounded-xl animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Revenue Overview</h3>
              <p className="text-sm text-neutral-400">Daily revenue for the past week</p>
            </div>
            <button className="text-sm text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="day" stroke="#4B5563" tick={{ fill: "#9CA3AF" }} />
              <YAxis stroke="#4B5563" tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E2535",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#F5820A" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F5820A"
                strokeWidth={3}
                dot={{ fill: "#F5820A", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Recent Orders</h3>
              <p className="text-sm text-neutral-400">You have 4 active orders</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-400/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    {order.initials}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{order.customer}</p>
                    <p className="text-xs text-neutral-500">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white text-sm mb-1.5">{order.amount}</p>
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[order.status] || "bg-white/10 text-neutral-400"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-center font-semibold text-sm text-orange-400 hover:text-orange-300 transition-colors py-2">
            View All Orders →
          </button>
        </Card>
      </div>
    </div>
  );
}
