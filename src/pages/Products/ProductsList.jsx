import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const mockProducts = [
  { id: 1, name: "Red T-Shirt", price: 19.99, stock: 42, status: "Active" },
  { id: 2, name: "Blue Hoodie", price: 39.99, stock: 8, status: "Low stock" },
];

export default function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Later: replace with API call
    setProducts(mockProducts);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <Button>+ Add Product</Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">£{p.price.toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "Active" ? "success" : "warning"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button className="text-xs text-slate-600 hover:text-slate-900">
                    Edit
                  </button>
                  <button className="text-xs text-rose-600 hover:text-rose-800">
                    Archive
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No products yet. Click &ldquo;Add Product&rdquo; to create
                  one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
