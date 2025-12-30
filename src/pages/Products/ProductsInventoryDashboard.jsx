import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  AlertCircle,
  TrendingDown,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext"; 
import api from "../../services/api";

export default function ProductsInventoryDashboard() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch products with inventory
  const fetchProductsWithInventory = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get("/store/products", {
        params: { page, per_page: 15 },
      });

      // Handle API response structure - check response directly and response.data
      const productData = response?.data;
      
      if (productData && Array.isArray(productData)) {
        setProducts(productData);

        // Use statistics from API response
        if (response.statistics) {
          setStats({
            totalProducts: response.statistics.total_products || 0,
            inStock: response.statistics.in_stock_products || 0,
            lowStock: response.statistics.low_stock_products || 0,
            outOfStock: response.statistics.out_of_stock_products || 0,
          });
        } else {
          calculateStats(productData);
        }

        // Set pagination metadata
        if (response.meta) {
          setPagination({
            currentPage: response.meta.current_page || 1,
            lastPage: response.meta.last_page || 1,
            perPage: response.meta.per_page || 15,
            total: response.meta.total || 0,
          });
        }
      } else {
        toast.error("Unexpected response format from server");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics (fallback)
  const calculateStats = (items) => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    items.forEach((item) => {
      const quantity = item.stock_qty || 0;
      const reorderThreshold = item.reorder_threshold || 5;

      if (quantity === 0) {
        outOfStock++;
      } else if (quantity <= reorderThreshold) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    setStats({
      totalProducts: items.length,
      inStock,
      lowStock,
      outOfStock,
    });
  };

  // Adjust stock quantity
  const handleAdjustQuantity = async (storeProductId, productId, adjustment) => {
    try {
      const response = await api.post("/store/inventory/adjust", {
        product_id: productId,
        store_product_id: storeProductId,
        adjustment_quantity: adjustment,
        reason: "Manual adjustment from dashboard",
      });

      // Update local state optimistically
      setProducts((prev) =>
        prev.map((item) =>
          item.id === storeProductId
            ? {
                ...item,
                stock_qty: Math.max(0, (item.stock_qty || 0) + adjustment),
              }
            : item
        )
      );

      toast.success(response?.message || "Stock adjusted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to adjust stock");
      await fetchProductsWithInventory();
    }
  };

  // Get stock status
  const getStockStatus = (item) => {
    const qty = item.stock_qty || 0;
    const reorderThreshold = item.reorder_threshold || 5;

    if (qty === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700", badge: "error" };
    } else if (qty <= reorderThreshold) {
      return { label: "Low Stock", color: "bg-orange-100 text-orange-700", badge: "warning" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700", badge: "success" };
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = products.filter((item) => {
      const name = (item.product?.name || "").toLowerCase();
      const brand = (item.product?.brand || "").toLowerCase();
      const sku = (item.sku || "").toLowerCase();
      
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        brand.includes(searchQuery.toLowerCase()) ||
        sku.includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (filterStatus !== "all") {
        const status = getStockStatus(item);
        const statusKey = status.badge;
        if (filterStatus === "low-stock" && statusKey !== "warning") matchesStatus = false;
        if (filterStatus === "out-of-stock" && statusKey !== "error") matchesStatus = false;
        if (filterStatus === "in-stock" && statusKey !== "success") matchesStatus = false;
      }

      return matchesSearch && matchesStatus;
    });

    // Sort filtered products
    filtered.sort((a, b) => {
      const nameA = (a.product?.name || "").toLowerCase();
      const nameB = (b.product?.name || "").toLowerCase();
      const qtyA = a.stock_qty || 0;
      const qtyB = b.stock_qty || 0;

      if (sortBy === "name") {
        return nameA.localeCompare(nameB);
      } else if (sortBy === "stock") {
        return qtyB - qtyA;
      }
      return 0;
    });

    return filtered;
  };

  useEffect(() => {
    fetchProductsWithInventory();
  }, []);

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products & Inventory</h1>
          <p className="text-slate-600 mt-1">Manage products and track stock levels.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/products/add">
            <Button className="flex items-center gap-2 py-2 px-4 bg-[#556B2F] text-white font-semibold hover:bg-[#4a5d29]">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-slate-400">
          <div>
            <p className="text-xs font-medium text-slate-600">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProducts}</p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div>
            <p className="text-xs font-medium text-slate-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.inStock}</p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div>
            <p className="text-xs font-medium text-slate-600">Low Stock</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div>
            <p className="text-xs font-medium text-slate-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#556B2F] text-sm"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#556B2F] text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                viewMode === "grid"
                  ? "bg-[#556B2F] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-[#556B2F] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </Card>

      {/* Products Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const status = getStockStatus(product);
              const qty = product.stock_qty || 0;
              const comparePrice = parseFloat(product.compare_at_price || product.price || 0);
              const currentPrice = parseFloat(product.price || 0);
              const discountPercent = comparePrice > currentPrice 
                ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) 
                : 0;

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative h-48 bg-slate-100">
                    {product.product?.image_url ? (
                      <img
                        src={product.product.image_url}
                        alt={product.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <Badge variant={status.badge} className="absolute top-3 right-3">
                      {status.label}
                    </Badge>
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {product.product?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {product.product?.brand || "No brand"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">SKU: {product.sku}</p>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mt-3 mb-4">
                      <p className="font-semibold text-slate-900">
                        £{currentPrice.toFixed(2)}
                      </p>
                      {comparePrice > currentPrice && (
                        <p className="text-xs text-slate-500 line-through">
                          £{comparePrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Stock Progress */}
                    <div className="space-y-2 mb-4 mt-auto">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-700">
                          Stock: {qty} units
                        </span>
                        {product.reorder_threshold && qty <= product.reorder_threshold && (
                          <span className="text-xs text-orange-600 font-medium">
                            Reorder: {product.reorder_quantity || 0}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            qty === 0
                              ? "bg-red-500"
                              : qty <= product.reorder_threshold
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min((qty / Math.max(product.reorder_quantity, 20)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdjustQuantity(product.id, product.product_id, -1)}
                        disabled={qty === 0}
                        className="flex-1 p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
                        title="Decrease stock"
                      >
                        <ChevronDown className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleAdjustQuantity(product.id, product.product_id, 1)}
                        className="flex-1 p-2 text-slate-500 hover:bg-slate-100 rounded transition"
                        title="Increase stock"
                      >
                        <ChevronUp className="w-4 h-4 mx-auto" />
                      </button>
                      <Link
                        to={`/products/edit/${product.product_id}`}
                        className="flex-1 p-2 text-slate-500 hover:bg-slate-100 rounded transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4 mx-auto" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Products List View */}
      {viewMode === "list" && (
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No products found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const qty = product.stock_qty || 0;
                const currentPrice = parseFloat(product.price || 0);
                const comparePrice = parseFloat(product.compare_at_price || 0);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex gap-4 flex-1 mb-4 md:mb-0">
                      {product.product?.image_url ? (
                        <img
                          src={product.product.image_url}
                          alt={product.product.name}
                          className="w-16 h-16 object-cover rounded bg-slate-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {product.product?.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {product.product?.brand || "No brand"} • SKU: {product.sku}
                        </p>
                        <Badge variant={status.badge} className="mt-2">
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 w-full md:w-auto">
                      <div className="flex-1 md:flex-none">
                        <p className="text-xs text-slate-500 mb-1">Stock</p>
                        <p className="font-semibold text-slate-900">{qty} units</p>
                      </div>

                      <div className="flex-1 md:flex-none">
                        <p className="text-xs text-slate-500 mb-1">Price</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">£{currentPrice.toFixed(2)}</p>
                          {comparePrice > currentPrice && (
                            <p className="text-xs text-slate-500 line-through">£{comparePrice.toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAdjustQuantity(product.id, product.product_id, -1)}
                          disabled={qty === 0}
                          className="p-2 text-slate-500 hover:bg-slate-200 disabled:opacity-50 rounded transition"
                          title="Decrease stock"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAdjustQuantity(product.id, product.product_id, 1)}
                          className="p-2 text-slate-500 hover:bg-slate-200 rounded transition"
                          title="Increase stock"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/products/edit/${product.product_id}`}
                          className="p-2 text-slate-500 hover:bg-slate-200 rounded transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
