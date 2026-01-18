import Card from "../components/ui/Card";
import { colors } from "../lib/colors";
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
      iconColor: colors.primary.main,
    },
    {
      label: "Active Orders",
      change: "+4",
      trend: "up",
      value: "+24",
      subtext: "since last hour",
      icon: ShoppingCart,
      iconColor: colors.accent.olive,
    },
    {
      label: "Low Stock Items",
      value: "7",
      subtext: "Requires attention",
      icon: Package,
      iconColor: colors.primary.main,
    },
    {
      label: "Total Customers",
      value: "1,203",
      change: "+4.8%",
      trend: "up",
      subtext: "new this week",
      icon: PoundSterlingIcon,
      iconColor: colors.accent.olive,
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
      statusColor: colors.accent.olive
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
    }
  ];

  return (
    <div className="w-full space-y-8 px-6 py-6">
      {/* Hero Welcome Card with Purple Gradient */}
      <div className="p-12 text-white shadow-2xl rounded-lg animate-fade-in" style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent.purple} 0%, ${colors.accent.purpleDark} 100%)` }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4">Welcome back, Sokuya Store!</h2>
            <p className="text-white/80 mb-8">You have 4 new orders to prepare and 2 low stock alerts.</p>
            <div className="flex gap-4">
              <button className="bg-white px-8 py-3 font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-200 rounded-lg" style={{ color: colors.primary.main }}>
                Manage Orders
              </button>
              <button className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-200 rounded-lg">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - 4 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
            const cardBackgrounds = [
            { bg: 'bg-gradient-to-br from-orange-50 to-orange-100', accentBorder: colors.primary.main },
            { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', accentBorder: colors.accent.olive },
            { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', accentBorder: colors.accent.purple },
            { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', accentBorder: colors.accent.teal },
            ];
            const theme = cardBackgrounds[idx % cardBackgrounds.length];

            return (
            <Card 
              key={stat.label} 
              className={`p-8 rounded-lg shadow ${theme.bg} animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              style={{ 
                borderLeftColor: theme.accentBorder,
                animationDelay: `${idx * 100}ms`
              }}
            >
              <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-lg`} style={{ backgroundColor: `${theme.accentBorder}15` }}>
                <Icon className={`w-6 h-6`} style={{ color: theme.accentBorder }} />
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
        <Card className="lg:col-span-2 p-8 rounded-lg animate-slide-up">
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
                  <div className="w-10 h-10 flex items-center justify-center font-semibold" style={{ backgroundColor: `${colors.primary.main}15`, color: colors.primary.main }}>
                    {order.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 text-sm mb-2">{order.amount}</p>
                  <span className="inline-block px-3 py-2 text-xs font-medium" style={{ backgroundColor: order.statusColor ? `${order.statusColor}20` : 'rgb(229, 231, 235)', color: order.statusColor || 'rgb(55, 65, 81)' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 text-center font-semibold text-sm py-2" style={{ color: colors.primary.main }} onMouseEnter={(e) => e.target.style.color = colors.primary.dark} onMouseLeave={(e) => e.target.style.color = colors.primary.main}>
            View All Orders →
          </button>
        </Card>
      </div>
    </div>
  );
}
