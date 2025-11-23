import Card from "../components/ui/Card";

export default function Dashboard() {
  // Later: fetch these stats from API
  const stats = [
    { label: "Today's Revenue", value: "£1,230" },
    { label: "Orders Today", value: "34" },
    { label: "Active Products", value: "128" },
    { label: "Pending Orders", value: "7" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="text-xs font-medium text-slate-500 uppercase">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Placeholder for charts, recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <div className="font-medium text-slate-900 mb-2">Recent Orders</div>
          <p className="text-sm text-slate-500">
            You can show a table of the latest orders here.
          </p>
        </Card>
        <Card className="p-4">
          <div className="font-medium text-slate-900 mb-2">
            Low Stock Products
          </div>
          <p className="text-sm text-slate-500">
            Highlight products that need restocking.
          </p>
        </Card>
      </div>
    </div>
  );
}
