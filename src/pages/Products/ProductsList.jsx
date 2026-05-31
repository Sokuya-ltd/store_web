import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import productsData from "../../dataset/store_products.json";
import { View, Pencil, Trash2, MoreVertical } from "lucide-react";

const mockProducts = productsData.store_products;

// Define table columns
const columns = [
  {
    accessorFn: (row) => row.product?.name,
    id: "product",
    header: "Product",
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
        <img
          src={row.original.product?.image_url}
          alt={row.original.product?.name}
          className="w-10 h-10 object-cover shadow-md bg-white/10"
        />
        <div>
          <p className="font-medium text-white">{row.original.product?.name}</p>
          <p className="text-xs text-neutral-500 truncate max-w-[180px]">{row.original.product?.description}</p>
        </div>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.product?.brand,
    id: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => <span className="font-medium">£{getValue()?.toFixed(2)}</span>,
  },
  {
    accessorFn: (row) => row.product?.recommended_price,
    id: "recommended_price",
    header: "Rec. Price",
    cell: ({ getValue }) => <span className="text-neutral-400">£{getValue()?.toFixed(2)}</span>,
  },
  {
    accessorKey: "stock_qty",
    header: "Stock",
  },
  {
    accessorFn: (row) => row.product?.unit,
    id: "unit",
    header: "Unit",
  },
  {
    accessorFn: (row) => row.product?.tags || [],
    id: "tags",
    header: "Tags",
    enableSorting: false,
    cell: ({ getValue }) => {
      const tags = getValue() || [];
      return (
        <div className="flex flex-wrap gap-1 group relative">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-orange-400/20 text-orange-300">
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-2 py-0.5 text-xs cursor-pointer relative group/tags rounded-md bg-orange-400/10 text-orange-300">
              +{tags.length - 2}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover/tags:opacity-100 group-hover/tags:visible transition-all duration-200 whitespace-nowrap z-50">
                {tags.slice(2).join(", ")}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      let variant = "danger";
      if (row.original.status === "active") {
        variant = "success";
      } else if (row.original.status === "inactive") {
        variant = "warning";
      }
      return (
        <Badge variant={variant}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="relative group">
        <button 
          className="text-xs px-3 py-1 text-white flex items-center gap-1 rounded-md transition-colors bg-orange-400 hover:bg-orange-500"
        >
          <MoreVertical className="w-3 h-3" />
          Manage
        </button>
        <ul className="absolute right-0 mt-1 w-36 bg-navy-800 border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-md overflow-hidden">
          <li>
            <Link
              to={`/products/${row.original.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-xs text-orange-400 hover:bg-white/10 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Link>
          </li>
          <li>
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-neutral-300 hover:bg-white/10 transition-colors"
            >
              <View className="w-3 h-3" />
              View Details
            </button>
          </li>
          <li>
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-green-400 hover:bg-white/10 transition-colors"
            >
              {row.original.status === "active" ? "Unpublish" : "Publish"}
            </button>
          </li>
          <hr className="my-1 border-white/10" />
          <li>
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-red-400 hover:bg-white/10 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </li>
        </ul>
      </div>
    ),
  },
];

export default function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Later: replace with API call
    setProducts(mockProducts);
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 animate-fade-in">
        <div>
          <h2 className="text-xl font-semibold text-white">Products</h2>
          <p className="text-neutral-400">Manage your store inventory and catalog.</p>
        </div>
        <Link 
          to="/products/add" 
          className="inline-block px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold shadow-md transition-all duration-200 rounded-lg hover:scale-105 hover:shadow-lg"
        >
          + Add Product
        </Link>
      </div>

      <Card className="p-4 shadow-md animate-slide-up">
        <DataTable
          data={products}
          columns={columns}
          searchPlaceholder="Search products..."
          pageSize={8}
        />
      </Card>
    </div>
  );
}
