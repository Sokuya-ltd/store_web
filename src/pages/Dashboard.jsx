import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Clock, PoundSterlingIcon } from "lucide-react";
import { colors } from "../lib/colors";

export default function Dashboard() {
  // Stats data with icons and trends
  const stats = [
    {
      label: "Total Sales",
      value: "14,732",
      change: "+4.3%",
      trend: "up",
      icon: PoundSterlingIcon,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Total Expenses",
      value: "£28,346.00",
      change: "+0.2%",
      trend: "up",
      icon: ShoppingCart,
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      label: "Total Visitors",
      value: "1,29,368",
      change: "-7.8%",
      trend: "down",
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Orders",
      value: "35,367",
      change: "+2.5%",
      trend: "up",
      icon: Clock,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const recentOrders = [
    { id: 1, product: "Smart Phone", category: "Mobiles", price: "$199.99" },
    { id: 2, product: "White Headphones", category: "Music", price: "$79.49" },
    { id: 3, product: "Stop Watch", category: "Electronics", price: "$49.29" },
    { id: 4, product: "Kikon Camera", category: "Electronics", price: "$1,699.00" },
    { id: 5, product: "Photo Frame", category: "Furniture", price: "$29.99" },
  ];

  const topProducts = [
    { id: 1, name: "Ethnic School bag for children (24L)", category: "Bags", stock: "In Stock", sales: 5093 },
    { id: 2, name: "Leather jacket for men (S,M,L,XL)", category: "Clothing", stock: "In Stock", sales: 6890 },
    { id: 3, name: "Childrens Teddy toy of high quality", category: "Toys", stock: "Out Of Stock", sales: 5143 },
    { id: 4, name: "Orange smart watch with square dial (24mm)", category: "Fashion", stock: "Out Of Stock", sales: 10234 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Ecommerce</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Reports →</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side - Stats cards in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${stat.bgColor} shrink-0`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-slate-600">
                        {stat.trend === "up" ? "Increase by" : "Decreased by"}
                      </span>
                      <span className={`font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right side - Earnings Chart */}
        <Card>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Earnings</h3>
              <button className="text-sm text-slate-500 hover:text-slate-700">View All →</button>
            </div>
          </div>
          <div className="p-6 flex items-center justify-center bg-slate-50 rounded-lg min-h-[200px]">
            <p className="text-sm text-slate-500">Chart will go here</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Orders</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{order.product}</p>
                    <p className="text-sm text-slate-500">{order.category}</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">{order.price}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Earnings Chart Placeholder */}
        <Card className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Earnings</h3>
              <button className="text-sm text-slate-500 hover:text-slate-700">View All →</button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg min-h-[200px]">
              <p className="text-sm text-slate-500">Chart will go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
