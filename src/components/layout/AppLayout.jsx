import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Settings, ShoppingCart, User, HelpCircle, LogOut } from "lucide-react";
import { colors } from "../../lib/colors";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      <aside className="fixed left-0 top-0 h-screen w-64 text-slate-100 hidden md:flex flex-col" style={{ backgroundColor: colors.primary.main }}>
        <div className="px-6 py-4 text-xl font-semibold border-b border-white/20">
          Africana Troprican
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />}>Dashboard</NavItem>
          <NavItem to="/products" icon={<Package size={18} />}>Products</NavItem>
          <NavItem to="/orders" icon={<ShoppingCart size={18} />}>Orders</NavItem>
        </nav>

        {/* Fixed bottom nav for manage account */}
        <div className="mt-auto px-3 py-4 border-t border-white/20">
          <NavItem to="/account" icon={<Settings size={18} />}>Manage Account</NavItem>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200">
          <div className="font-semibold">Welcome back 👋</div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-500">John Ovo</span>
              <span className="text-xs text-slate-400">store admin</span>
            </div>
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
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
        <main className="flex-1 p-4 md:p-6">
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
