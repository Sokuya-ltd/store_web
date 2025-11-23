import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const mockOrders = [
  {
    id: 1,
    orderId: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 159.99,
    status: "Pending",
    createdAt: "2025-11-22",
  },
  {
    id: 2,
    orderId: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 89.99,
    status: "Shipped",
    createdAt: "2025-11-21",
  },
];

function OrderStatusBadge({ status }) {
  const variantMap = {
    Pending: "warning",
    Paid: "success",
    Shipped: "info",
    Cancelled: "danger",
  };

  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Later: replace with API call
    setOrders(mockOrders);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Orders</h2>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{order.orderId}</td>
                <td className="px-4 py-3">
                  <div>{order.customer}</div>
                  <div className="text-xs text-slate-500">{order.email}</div>
                </td>
                <td className="px-4 py-3">£{order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">{order.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs text-slate-600 hover:text-slate-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
