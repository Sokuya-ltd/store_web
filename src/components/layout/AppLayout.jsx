import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Package, Settings, ShoppingCart, User, HelpCircle, LogOut, Bell, Menu, X } from "lucide-react";
import { colors } from "../../lib/colors";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <>
      <div className="px-6 py-4 text-xl font-semibold border-b border-white/20">
        Africana Troprican
      </div>
      <nav className="flex-1 px-3 py-4 space-y-3">
        <NavItem to="/" icon={<LayoutDashboard size={18} />}>Dashboard</NavItem>
        <NavItem to="/products" icon={<Package size={18} />}>Products</NavItem>
        <NavItem to="/orders" icon={<ShoppingCart size={18} />}>Orders</NavItem>
      </nav>
      <div className="mt-auto px-3 py-4 border-t border-white/20">
        <NavItem to="/settings" icon={<Settings size={18} />}>Manage Account</NavItem>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 text-slate-100 hidden md:flex flex-col" style={{ backgroundColor: colors.primary.main }}>
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <aside className="h-full w-64 bg-[#FF6B1A] text-slate-100 flex flex-col shadow-xl animate-slide-in" style={{ backgroundColor: colors.primary.main }}>
            <button className="absolute top-4 right-4 text-white" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X size={28} />
            </button>
            {SidebarContent}
          </aside>
          {/* Overlay background */}
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full md:ml-64">
        <header className="h-15.5 flex items-center justify-between px-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu size={24} />
            </button>
            <span className="font-semibold">Welcome back 👋</span>
          </div>
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative group">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500"></span>
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">5</span>
              </button>
              {/* Notifications Dropdown */}
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1">5 unread</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <a href="#" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">New order received</p>
                        <p className="text-xs text-slate-500 mt-0.5">Order #1234 from John Doe</p>
                        <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-green-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Payment confirmed</p>
                        <p className="text-xs text-slate-500 mt-0.5">£299.99 received for order #1233</p>
                        <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-orange-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Low stock alert</p>
                        <p className="text-xs text-slate-500 mt-0.5">Blue Hoodie - Only 3 items left</p>
                        <p className="text-xs text-slate-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-purple-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">New customer review</p>
                        <p className="text-xs text-slate-500 mt-0.5">5 stars for Red T-Shirt</p>
                        <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-red-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Order cancelled</p>
                        <p className="text-xs text-slate-500 mt-0.5">Customer cancelled order #1230</p>
                        <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-3 border-t border-slate-200">
                  <a href="#" className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all notifications
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-500">John Ovo</span>
              <span className="text-xs text-slate-400">store admin</span>
            </div>
            <div className="relative group">
              <div className="w-8 h-8 bg-slate-300 hover:bg-slate-400 transition-colors flex items-center justify-center text-xs font-semibold text-slate-700 cursor-pointer shadow-md">
                JO
              </div>
              <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <User size={16} />
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <HelpCircle size={16} />
                    <span>Support</span>
                  </a>
                  <hr className="my-1 border-slate-200" />
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 w-full px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 text-sm font-medium transition ${isActive
          ? "bg-[#FF6B1A] text-white"
          : "text-slate-300 hover:bg-[#FF6B1A] hover:text-white"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
