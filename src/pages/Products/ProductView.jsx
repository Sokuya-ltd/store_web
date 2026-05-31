import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Edit2, Trash2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
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
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"
                    ></div>
                    <p className="mt-4 text-neutral-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full space-y-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate("/products")}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
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
    const discountPercent =
        comparePrice > currentPrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;

    const getStockStatus = () => {
        const qty = product.stock_qty || 0;
        if (qty === 0) {
            return { label: "Out of Stock", badge: "danger" };
        } else if (qty <= product.reorder_threshold) {
            return { label: "Low Stock", badge: "warning" };
        }
        return { label: "In Stock", badge: "success" };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="w-full space-y-6 py-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-3 flex-1">
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-1 p-2 hover:bg-white/10 rounded-lg transition duration-200"
                        title="Back to products"
                    >
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">{productInfo.name}</h1>
                        <p className="text-sm text-neutral-400 font-medium">View and manage product information</p>
                    </div>
                </div>
                <Badge variant={stockStatus.badge} className="mt-1">
                    {stockStatus.label}
                </Badge>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image Slider (2 cols) */}
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden shadow-lg border border-white/10">
                        <div className="bg-navy-700/50 aspect-video flex items-center justify-center relative group">
                            {media && media.length > 0 ? (
                                <>
                                    <img
                                        src={media[currentImageIndex]?.url}
                                        alt={productInfo.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Navigation Buttons */}
                                    {media.length > 1 && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex((prev) =>
                                                        prev === 0 ? media.length - 1 : prev - 1
                                                    )
                                                }
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-navy-800/90 shadow-xl transition duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 text-orange-400"
                                            title="Previous image"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setCurrentImageIndex((prev) =>
                                                        prev === media.length - 1 ? 0 : prev + 1
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-navy-800/90 shadow-xl transition duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 text-orange-400"
                                                title="Next image"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>

                                            {/* Image Counter */}
                                            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-semibold">
                                                {currentImageIndex + 1} / {media.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                                    <svg className="w-24 h-24 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-neutral-500 font-medium">No images available</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {media.length > 1 && (
                            <div className="p-5 bg-white/5 border-t border-white/10">
                                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                                    Gallery
                                </h4>
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {media.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition duration-200 hover:scale-105"
                                            style={{
                                                borderColor:
                                                    currentImageIndex === index
                                                        ? "#F5820A"
                                                        : "rgba(255,255,255,0.15)",
                                            }}
                                            title={`View image ${index + 1}`}
                                        >
                                            <img src={image.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-5">
                    {/* Pricing Card */}
                    <Card className="p-6 bg-orange-400/10 border border-orange-400/20 shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">Price</p>
                            {discountPercent > 0 && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600">
                                    -{discountPercent}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-5xl font-black text-white mb-3 tracking-tight">
                            £{currentPrice.toFixed(2)}
                        </h3>

                        {comparePrice > currentPrice && (
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-xs font-semibold text-orange-300 uppercase tracking-wide mb-1">
                                    Compared Price
                                </p>
                                <p className="text-lg line-through text-neutral-500 font-semibold">
                                    £{comparePrice.toFixed(2)}
                                </p>
                                <p className="text-sm text-green-400 font-bold mt-1">
                                    Save £{(comparePrice - currentPrice).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Stock Status Card */}
                    <Card className="p-6 border border-white/10 shadow-md">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                            Stock Status
                        </p>
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                                    Units Available
                                </p>
                                <p className="text-4xl font-black text-white">{product.stock_qty || 0}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={stockStatus.badge} className="flex-1">
                                    {stockStatus.label}
                                </Badge>
                            </div>
                            {product.reorder_threshold > 0 && (
                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                                        Reorder Threshold
                                    </p>
                                    <p className="text-white font-bold">{product.reorder_threshold} units</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Category Card */}
                    <Card className="p-6 bg-orange-400/10 border border-orange-400/20 shadow-md">
                        <p className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-2">
                            Category
                        </p>
                        <p className="text-xl font-bold text-white">
                            {productInfo.category_id || productInfo.category?.name || "—"}
                        </p>
                    </Card>

                    {/* Action Buttons */}
                    <Link
                        to={`/products/edit/${id}`}
                        className="w-full py-3 px-4 rounded-lg text-center font-bold transition duration-200 bg-orange-400 hover:bg-orange-500 text-white shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                        <Edit2 className="w-4 h-4 group-hover:rotate-12 transition duration-200" />
                        Edit Product
                    </Link>

                    <button
                        className="w-full py-3 px-4 rounded-lg font-bold transition duration-200 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                        disabled
                        title="Delete functionality coming soon"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Product
                    </button>
                </div>
            </div>

            {/* Product Information Section */}
            <Card className="p-8 shadow-md border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10">
                    Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Description */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Description</p>
                        <p className="text-neutral-200 leading-relaxed text-sm">
                            {productInfo.description || "No description provided"}
                        </p>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Brand</p>
                        <p className="text-white font-semibold text-lg">{productInfo.brand || "—"}</p>
                    </div>

                    {/* SKU */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">SKU</p>
                        <p className="text-white font-mono font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                            {product.sku || "—"}
                        </p>
                    </div>

                    {/* Barcode */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Barcode</p>
                        <p className="text-white font-mono font-bold bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                            {product.barcode || "—"}
                        </p>
                    </div>

                    {/* Weight */}
                    {product.weight && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Weight</p>
                                <p className="text-white font-semibold text-lg">{product.weight} kg</p>
                        </div>
                    )}

                    {/* Unit */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Unit</p>
                        <p className="text-white font-semibold text-lg">{productInfo.unit || "—"}</p>
                    </div>
                </div>

                {/* Store Notes */}
                {product.store_notes && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                            Store Notes
                        </p>
                        <div className="bg-orange-400/10 border-l-4 border-orange-400 text-orange-200 px-5 py-4 rounded-r-lg shadow-sm">
                            <p className="font-medium leading-relaxed">{product.store_notes}</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Product ID Section */}
            <Card className="p-6 border border-white/10 shadow-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                            Product ID
                        </p>
                        <p className="text-2xl font-mono font-bold text-white">
                            {product.product_id || id}
                        </p>
                    </div>
                    <button
                        onClick={handleCopyProductId}
                        className={`p-3 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 ${
                            copiedProductId ? "bg-orange-400 text-white" : "bg-white/10 text-neutral-300 hover:bg-white/20"
                        }`}
                        title={copiedProductId ? "Copied!" : "Copy product ID"}
                    >
                        {copiedProductId ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
}
