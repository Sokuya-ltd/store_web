import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Clock } from "lucide-react";
import { colors } from "../lib/colors";

export default function Dashboard() {
  // Stats data with icons and trends
  const stats = [
    {
      label: "Total Sales",
      value: "14,732",
      change: "+4.3%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
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
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
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
        <div className="flex gap-2">
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500">this month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
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
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Earnings</h3>
            <button className="text-sm text-slate-500 hover:text-slate-700">View All →</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Chart will go here</p>
          </div>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Top Selling Products</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">S.no</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                      <span className="text-sm text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{product.category}</td>
                  <td className="px-6 py-4">
                    <Badge variant={product.stock === "In Stock" ? "success" : "danger"}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{product.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
