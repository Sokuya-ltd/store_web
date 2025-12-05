import Card from "../components/ui/Card";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Clock, PoundSterlingIcon } from "lucide-react";

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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mt-5">
        <h2 className="text-2xl font-bold text-slate-900">Ecommerce</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Reports →</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Card className="mt-4 md:mt-0">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Earnings</h3>
              <button className="text-sm text-slate-500 hover:text-slate-700">View All →</button>
            </div>
          </div>
          <div className="p-4 md:p-6 flex items-center justify-center bg-slate-50 rounded-lg min-h-40 md:min-h-[200px]">
            <p className="text-sm text-slate-500">Chart will go here</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="md:col-span-2">
          <div className="p-4 md:p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#D35400] rounded-full mr-2"></span>
                Recent Orders
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-3 md:p-4 flex items-center justify-between hover:bg-slate-50">
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
        {/* Top Customers Card */}
        <Card className="p-0 overflow-hidden mt-4 md:mt-0">
          <div className="border-b-2 border-blue-100 flex items-center justify-between px-3 pt-3 pb-2 md:px-5 md:pt-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D35400] rounded-full mr-2"></span>
              Top Customers
            </h3>
            <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">View All <span className="text-xs">▼</span></button>
          </div>
          <div className="px-3 py-2 md:px-5">
            <ul className="divide-y divide-gray-100">
              {/* Emma Wilson */}
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Emma Wilson" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Emma Wilson</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">15 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$1,835</div>
              </li>
              {/* Robert Lewis */}
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Robert Lewis" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Robert Lewis</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">18 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$2,415</div>
              </li>
              {/* Angelina Hose */}
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Angelina Hose" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Angelina Hose</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">21 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$2,341</div>
              </li>
              {/* Samantha Sam */}
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Samantha Sam" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Samantha Sam</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">24 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$2,624</div>
              </li>
              {/* Additional Customers */}
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Michael Chen" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Michael Chen</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">13 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$1,512</div>
              </li>
              <li className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src="https://randomuser.me/api/portraits/women/23.jpg" alt="Priya Patel" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-900">Priya Patel</span>
                      <span className="text-blue-500"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><path d="M17 9l-5.5 6L7 11.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </div>
                    <div className="text-xs text-gray-500">17 Purchases</div>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 text-right">$1,980</div>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
