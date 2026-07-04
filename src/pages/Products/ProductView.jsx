import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Edit2, ChevronLeft, ChevronRight, Copy, Check, MoreVertical, Home, TrendingDown } from "lucide-react";
import api from "../../services/api";

export default function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);
    const [media, setMedia] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [copiedProductId, setCopiedProductId] = useState(false);
    const [apiCategories, setApiCategories] = useState([]);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await api.get(`/store/products/${id}`);
                if (!response.data) {
                    setError("Product not found");
                    setIsLoading(false);
                    return;
                }

                const storeProduct = response.data;
                setProduct(storeProduct);

                // Load API categories for category lookup
                const resources = response.resources || {};
                if (resources.categories) {
                    setApiCategories(resources.categories);
                }

                // Load media
                const mediaData = response.media || storeProduct.media || storeProduct.product?.media || [];
                setMedia(Array.isArray(mediaData) ? mediaData : []);

                setIsLoading(false);
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Failed to load product");
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleCopyProductId = () => {
        navigator.clipboard.writeText(product?.product_id || id);
        setCopiedProductId(true);
        setTimeout(() => setCopiedProductId(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
                    <p className="mt-4 text-neutral-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full space-y-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate("/products")} className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Product Details</h1>
                </div>
                <Card className="p-6 bg-red-400/10 border border-red-400/30">
                    <p className="text-red-300 font-medium">{error}</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-3 px-4 py-2 text-sm rounded-lg bg-orange-400 hover:bg-orange-500 text-white transition"
                    >
                        Back to Products
                    </button>
                </Card>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const productInfo = product.product || {};
    const currentPrice = parseFloat(product.price || 0);
    const comparePrice = parseFloat(product.compare_at_price || 0);
    const discountPercent = comparePrice > currentPrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;

    // Resolve category with full details
    let productCategory = productInfo.category;
    if (typeof productCategory === 'string' && apiCategories.length > 0) {
        productCategory = apiCategories.find(cat => cat.id === productCategory);
    }
    if (productCategory && typeof productCategory === 'object' && productCategory.id && !productCategory.name && apiCategories.length > 0) {
        const fullCategory = apiCategories.find(cat => cat.id === productCategory.id);
        if (fullCategory) {
            productCategory = fullCategory;
        }
    }
    if (!productCategory && product.category_id && apiCategories.length > 0) {
        productCategory = apiCategories.find(cat => cat.id === product.category_id);
    }

    const getStockStatus = () => {
        const qty = product.stock_qty || 0;
        if (qty === 0) {
            return { label: "Out of Stock", badge: "danger", color: "text-red-400" };
        } else if (qty <= product.reorder_threshold) {
            return { label: "Low Stock", badge: "warning", color: "text-yellow-400" };
        }
        return { label: "In Stock", badge: "success", color: "text-green-400" };
    };

    const stockStatus = getStockStatus();
    const stockHealthPercent = product.reorder_threshold > 0 
        ? Math.min(100, (product.stock_qty / (product.reorder_threshold * 3)) * 100) 
        : 0;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-navy-900/50 via-navy-900 to-navy-900/50">
            {/* Breadcrumb Navigation */}
            <div className="bg-navy-900/50 border-b border-white/10 px-4 sm:px-6 py-3 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
                    <button onClick={() => navigate("/")} className="text-neutral-400 hover:text-white transition">
                        <Home className="w-4 h-4" />
                    </button>
                    <span className="text-neutral-500">/</span>
                    <Link to="/products" className="text-neutral-400 hover:text-orange-400 transition">
                        Products
                    </Link>
                    {productCategory && (
                        <>
                            <span className="text-neutral-500">/</span>
                            <span className="text-neutral-400">{productCategory?.name}</span>
                        </>
                    )}
                    <span className="text-neutral-500">/</span>
                    <span className="text-white font-medium truncate">{productInfo.name}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Header with Quick Actions */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <button
                                onClick={() => navigate("/products")}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                                title="Back"
                            >
                                <ArrowLeft className="w-5 h-5 text-neutral-400" />
                            </button>
                            <h1 className="text-3xl font-bold text-white">{productInfo.name}</h1>
                            <Badge variant={stockStatus.badge}>{stockStatus.label}</Badge>
                        </div>
                        <div className="ml-11 flex items-center gap-2 text-sm text-neutral-400">
                            <span>SKU:</span>
                            <span className="font-mono text-neutral-300 font-medium">{product.sku || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Action Buttons - Prominent at top */}
                    <div className="flex gap-2 self-start lg:flex-col w-full lg:w-auto">
                        <Link
                            to={`/products/edit/${id}`}
                            className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-orange-400 hover:bg-orange-500 text-white font-medium transition flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit
                        </Link>
                        <div className="relative flex-1 lg:flex-none">
                            <button
                                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 transition flex items-center justify-center gap-2"
                                title="More options"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                            {showDeleteMenu && (
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Delete "${productInfo.name}"? This cannot be undone.`)) {
                                            api.delete(`/store/products/${id}`).then(() => {
                                                navigate("/products");
                                            }).catch(err => {
                                                alert("Failed to delete: " + err.message);
                                            });
                                        }
                                        setShowDeleteMenu(false);
                                    }}
                                    className="absolute right-0 mt-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 text-sm font-medium transition whitespace-nowrap z-10"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Image Gallery + Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden border border-white/10">
                            <div className="flex gap-4 p-4 bg-white/5">
                                {/* Main Image */}
                                <div className="flex-1">
                                    <div className="bg-navy-700/50 aspect-square flex items-center justify-center relative group rounded-lg overflow-hidden">
                                        {media && media.length > 0 ? (
                                            <>
                                                <img
                                                    src={media[currentImageIndex]?.url}
                                                    alt={productInfo.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                                {media.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-navy-800/80 hover:bg-navy-700 text-orange-400 opacity-0 group-hover:opacity-100 transition"
                                                            title="Previous"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setCurrentImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-navy-800/80 hover:bg-navy-700 text-orange-400 opacity-0 group-hover:opacity-100 transition"
                                                            title="Next"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                        {/* Dot Indicators */}
                                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                                            {media.map((_, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setCurrentImageIndex(idx)}
                                                                    className={`rounded-full transition ${idx === currentImageIndex ? 'bg-orange-400 w-6 h-2' : 'bg-white/30 hover:bg-white/50 w-2 h-2'}`}
                                                                    title={`Image ${idx + 1}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center text-neutral-600">
                                                <svg className="w-12 h-12 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-neutral-500">No images</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnails Vertical */}
                                {media.length > 1 && (
                                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                                        {media.slice(0, 5).map((image, idx) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                                    currentImageIndex === idx
                                                        ? 'border-orange-400 ring-2 ring-orange-400/30'
                                                        : 'border-white/20 hover:border-white/40'
                                                }`}
                                                title={`Image ${idx + 1}`}
                                            >
                                                <img src={image.url} alt={`${idx}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                        {media.length > 5 && (
                                            <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-neutral-400 font-medium flex-shrink-0">
                                                +{media.length - 5}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right: Consolidated Info Panel */}
                    <div className="space-y-4">
                        {/* Pricing */}
                        <Card className="p-5 bg-orange-400/10 border border-orange-400/20">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-xs font-bold text-orange-400 uppercase">Price</p>
                                {discountPercent > 0 && (
                                    <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-red-500">
                                        -{discountPercent}%
                                    </span>
                                )}
                            </div>
                            <p className="text-4xl font-black text-white mb-2">£{currentPrice.toFixed(2)}</p>
                            {comparePrice > currentPrice && (
                                <div className="text-sm space-y-1">
                                    <p className="text-neutral-400 line-through">£{comparePrice.toFixed(2)}</p>
                                    <p className="text-green-400 font-bold">Save £{(comparePrice - currentPrice).toFixed(2)}</p>
                                </div>
                            )}
                        </Card>

                        {/* Stock with Progress Bar */}
                        <Card className="p-5 border border-white/10">
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs font-bold text-neutral-400 uppercase">Stock Level</p>
                                        <span className={`text-sm font-bold ${stockStatus.color}`}>{product.stock_qty} units</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/20">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                                            style={{ width: `${Math.min(100, stockHealthPercent)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                        <span>Reorder: {product.reorder_threshold} units</span>
                                        <span>{Math.round(stockHealthPercent)}% Health</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={stockStatus.badge} className="flex-1 text-center">
                                        {stockStatus.label}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Category */}
                        {productCategory && (
                            <Card className="p-5 bg-blue-400/10 border border-blue-400/20">
                                <p className="text-xs font-bold text-blue-400 uppercase mb-2">Category</p>
                                <p className="font-semibold text-white mb-1">{productCategory?.name}</p>
                                {productCategory?.description && (
                                    <p className="text-xs text-neutral-400 line-clamp-2">{productCategory.description}</p>
                                )}
                            </Card>
                        )}

                        {/* Product ID - Easy Copy */}
                        <Card className="p-5 border border-white/10">
                            <p className="text-xs font-bold text-neutral-400 uppercase mb-2">Product ID</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-mono text-neutral-300 truncate">{product.product_id || id}</p>
                                <button
                                    onClick={handleCopyProductId}
                                    className={`p-2 rounded transition flex-shrink-0 ${
                                        copiedProductId
                                            ? 'bg-orange-400 text-white'
                                            : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                    }`}
                                    title="Copy"
                                >
                                    {copiedProductId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Additional Details */}
                <Card className="p-6 border border-white/10">
                    <p className="text-xs font-bold text-neutral-400 uppercase mb-4">Additional Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {product.barcode && (
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Barcode</p>
                                <p className="font-mono text-sm text-neutral-300">{product.barcode}</p>
                            </div>
                        )}
                        {product.weight && (
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Weight</p>
                                <p className="font-semibold text-neutral-300">{product.weight} kg</p>
                            </div>
                        )}
                        {productInfo.unit && (
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Unit</p>
                                <p className="font-semibold text-neutral-300">{productInfo.unit}</p>
                            </div>
                        )}
                        {productInfo.brand && (
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Brand</p>
                                <p className="font-semibold text-neutral-300">{productInfo.brand}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Store Notes */}
                {product.store_notes && (
                    <Card className="p-6 border-l-4 border-orange-400 bg-orange-400/5">
                        <p className="text-xs font-bold text-orange-400 uppercase mb-2">Store Notes</p>
                        <p className="text-neutral-300 leading-relaxed">{product.store_notes}</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
