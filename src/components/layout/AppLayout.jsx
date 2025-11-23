import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 hidden md:flex flex-col">
        <div className="px-6 py-4 text-xl font-semibold border-b border-slate-800">
          Store Admin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/">Dashboard</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/orders">Orders</NavItem>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200">
          <div className="font-semibold">Welcome back 👋</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">My Store</span>
            <div className="w-8 h-8 rounded-full bg-slate-300" />
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

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
