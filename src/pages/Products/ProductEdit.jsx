import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Image, Package, Tag, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

// Generates a SKU like "SL-8F3K2" from store name initials + random alphanumeric
function buildSku(storeName) {
    const initials = (storeName || "ST")
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 7);
    return `${initials}-${rand}`;
}

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { storeInfo } = useAuth();

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [product_id, setProductId] = useState(null);

    // API Resources
    const [apiCategories, setApiCategories] = useState([]);
    const [apiTags, setApiTags] = useState([]);

    const [storeTagSearch, setStoreTagSearch] = useState("");
    const [showStoreTagDropdown, setShowStoreTagDropdown] = useState(false);
    const storeTagDropdownRef = useRef(null);

    // Media state
    const [media, setMedia] = useState([]);
    const [mediaUpdating, setMediaUpdating] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        // Store product fields
        price: "",
        compare_at_price: "",
        stock_qty: "",
        stock_reserved: 0,
        reorder_threshold: 5,
        sku: "",
        barcode: "",
        status: "active",
        variant_options: null,
        weight: null,
        store_specific_tags: [],
        store_notes: null,
    });

    // Original store product data (for tracking changes)
    const [originalData, setOriginalData] = useState(null);

    const generateSku = useCallback(
        () => buildSku(storeInfo?.store_name || storeInfo?.name),
        [storeInfo]
    );

    // Auto-generate SKU on mount if the product has no SKU yet
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            sku: prev.sku || generateSku(),
        }));
    }, [generateSku]);

    // Load product data from API on mount
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await api.get(`/store/products/${id}`);

                if (!response.data) {
                    setError("Product data not found");
                    setIsLoading(false);
                    return;
                }

                const storeProduct = response.data;
                const resources = response.resources || {};
                const extracted_product_id = storeProduct.product_id
                console.log("Loaded product_id:", extracted_product_id);
                // Store product_id in state
                setProductId(extracted_product_id);

                // Store API resources
                if (resources.categories) {
                    setApiCategories(resources.categories);
                }
                if (resources.tags) {
                    setApiTags(resources.tags);
                }

                // Store original data for comparison
                setOriginalData(storeProduct);

                // Load media if available - check both response.media and storeProduct.media
                const mediaData = response.media || storeProduct.media || storeProduct.product?.media || [];
                setMedia(Array.isArray(mediaData) ? mediaData : []);

                // Populate form with API data
                setForm({
                    price: storeProduct.price?.toString() || "",
                    compare_at_price: storeProduct.compare_at_price?.toString() || "",
                    stock_qty: storeProduct.stock_qty?.toString() || "",
                    stock_reserved: storeProduct.stock_reserved || 0,
                    reorder_threshold: storeProduct.reorder_threshold || 5,
                    sku: storeProduct.sku || "",
                    barcode: storeProduct.barcode || "",
                    status: storeProduct.status || "active",
                    variant_options: storeProduct.variant_options || null,
                    weight: storeProduct.weight?.toString() || null,
                    store_specific_tags: storeProduct.store_specific_tags || [],
                    store_notes: storeProduct.store_notes || null,
                });

                setIsLoading(false);
            } catch (err) {
                if (err.status === 404) {
                    setError("Product not found");
                } else {
                    setError(err.message || "Failed to load product");
                }
                setIsLoading(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id]);

    // Filter store tags based on search and exclude already selected
    const filteredStoreTags = useMemo(() => {
        const selectedTags = form.store_specific_tags || [];
        return apiTags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(storeTagSearch.toLowerCase()) &&
                !selectedTags.includes(tag.name)
        );
    }, [storeTagSearch, form.store_specific_tags, apiTags]);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (storeTagDropdownRef.current && !storeTagDropdownRef.current.contains(event.target)) {
                setShowStoreTagDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateForm = (updates) => {
        setForm({ ...form, ...updates });
    };

    const removeTag = (index) => {
        const newTags = form.store_specific_tags.filter((_, i) => i !== index);
        updateForm({ store_specific_tags: newTags });
    };

    // Update media (alt text and primary status)
    const handleMediaUpdate = async (mediaId, updates) => {
        const notifyUser = (message, type = "error") => {
            if (typeof addToast === "function") {
                try { addToast(message, type); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable:", message);
            }
        };

        try {
            setMediaUpdating({ ...mediaUpdating, [mediaId]: true });

            await api.put(`/store/products/${product_id}/media/${mediaId}`, updates);

            // Update local media state
            setMedia(
                media.map((m) => {
                    if (m.id === mediaId) {
                        return { ...m, ...updates };
                    }
                    // If setting this as primary, unset others
                    if (updates.is_primary) {
                        return { ...m, is_primary: false };
                    }
                    return m;
                })
            );

            notifyUser("Media updated successfully", "success");
        } catch (err) {
            notifyUser(err.message || "Failed to update media", "error");
        } finally {
            setMediaUpdating({ ...mediaUpdating, [mediaId]: false });
        }
    };

    const handleMediaDelete = async (mediaId) => {
        const notifyUser = (message, type = "error") => {
            if (typeof addToast === "function") {
                try { addToast(message, type); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable:", message);
            }
        };

        if (!window.confirm("Remove this image from the product?")) {
            return;
        }

        try {
            setMediaUpdating({ ...mediaUpdating, [mediaId]: true });

            await api.delete(`/store/products/${id}/media/${mediaId}`);

            setMedia(media.filter((m) => m.id !== mediaId));
            notifyUser("Image deleted successfully", "success");
        } catch (err) {
            notifyUser(err.message || "Failed to delete image", "error");
        } finally {
            setMediaUpdating({ ...mediaUpdating, [mediaId]: false });
        }
    };

    // Handle image upload
    const handleImageUpload = async () => {
        console.log("Uploading images for product_id:", product_id);
        const notifyUser = (message, type = "error") => {
            if (typeof addToast === "function") {
                try { addToast(message, type); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable:", message);
            }
        };

        if (selectedFiles.length < 1) {
            notifyUser("Please select at least 1 images to upload", "error");
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/tiff",
            "image/tiff-fx",
            "image/svg+xml",
            "image/bmp",
            "image/vnd.microsoft.icon",
            "image/x-icon",
            "image/avif",
            "image/heic",
            "image/heif"
        ];

        // Validate all selected files
        for (let file of selectedFiles) {
            if (!allowedTypes.includes(file.type)) {
                notifyUser(`File "${file.name}" is not an allowed image format (JPG, PNG, GIF, WebP, TIFF, SVG, BMP, ICO, AVIF, HEIC)`, "error");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                notifyUser(`File "${file.name}" exceeds 5MB limit`, "error");
                return;
            }
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();
            // API expects 'images' as an array field
            // Append all selected files with array indices
            selectedFiles.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });

            console.log("Uploading to: /store/products/${id}/media");
            console.log("FormData contents:", {
                fileCount: selectedFiles.length,
                files: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
                currentMediaCount: media.length
            });

            const response = await api.uploadFile(
                `/store/products/${id}/media`,
                formData,
                { method: "POST" }
            );

            if (response) {
                // response should contain the new media items
                const newMedia = Array.isArray(response) ? response : [response];
                setMedia([...media, ...newMedia]);
                setSelectedFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                notifyUser(`Successfully uploaded ${selectedFiles.length} images`, "success");
            }
        } catch (err) {
            console.error("Image upload error:", err);
            
            // Handle validation errors (422)
            if (err.status === 422 && err.errors) {
                const errorMessages = Array.isArray(err.errors)
                    ? err.errors.join(", ")
                    : Object.values(err.errors)
                        .flat()
                        .join(", ");
                notifyUser(errorMessages || err.message || "Validation failed", "error");
            } else {
                notifyUser(err.message || "Failed to upload images", "error");
            }
        } finally {
            setUploadingImage(false);
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const notifyUser = (message, type = "error") => {
            if (typeof addToast === "function") {
                try { addToast(message, type); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable:", message);
            }
        };

        if (!form.price || parseFloat(form.price) <= 0) {
            notifyUser("Valid selling price required", "error");
            return false;
        }
        if (!form.stock_qty || parseInt(form.stock_qty) < 0) {
            notifyUser("Valid stock quantity required", "error");
            return false;
        }
        if (
            form.compare_at_price &&
            parseFloat(form.compare_at_price) < parseFloat(form.price)
        ) {
            notifyUser("Compare at price must be >= selling price", "error");
            return false;
        }
        if (form.reorder_threshold > form.stock_qty) {
            notifyUser("Reorder threshold must be <= current stock", "warning");
        }
        if (form.store_notes && form.store_notes.length > 500) {
            notifyUser("Store notes must not be greater than 500 characters", "error");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setIsSaving(true);

            // Build the update payload - only editable fields
            const updatePayload = {
                price: parseFloat(form.price),
                compare_at_price: form.compare_at_price
                    ? parseFloat(form.compare_at_price)
                    : null,
                stock_qty: parseInt(form.stock_qty),
                stock_reserved: parseInt(form.stock_reserved) || 0,
                reorder_threshold: parseInt(form.reorder_threshold) || 5,
                sku: form.sku,
                barcode: form.barcode,
                status: form.status,
                weight: form.weight ? parseFloat(form.weight) : null,
                store_specific_tags: form.store_specific_tags,
                store_notes: form.store_notes,
                variant_options: form.variant_options,
            };

            // Send update to API
            await api.put(`/store/products/${id}`, updatePayload);

            if (typeof addToast === "function") {
                try { addToast("Product updated successfully", "success"); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable: Product updated successfully");
            }
            navigate("/products");
        } catch (err) {
            const notifyError = (message) => {
                if (typeof addToast === "function") {
                    try { addToast(message, "error"); } catch (e) { console.error("Toast error:", e); }
                } else {
                    console.error("Toast unavailable:", message);
                }
            };

            if (err.status === 422 && err.errors) {
                // Handle validation errors
                const errorMessages = Object.values(err.errors)
                    .flat()
                    .join(", ");
                notifyError(errorMessages);
            } else if (err.status === 404) {
                notifyError("Product no longer exists");
            } else {
                notifyError(err.message || "Failed to update product");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-300 font-medium">Loading product...</p>
                    <p className="text-neutral-500 text-sm mt-1">Please wait while we fetch the details</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full space-y-6 py-6">
                <Card className="p-8 bg-gradient-to-br from-red-900/20 to-red-900/5 border-red-900/30">
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {error === "Product not found" ? "Product Not Found" : "Error Loading Product"}
                        </h3>
                        <p className="text-neutral-400 mb-6 max-w-sm">{error}</p>
                        <Button onClick={() => navigate("/products")} className="bg-orange-400 hover:bg-orange-500">
                            ← Back to Products
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const product = originalData?.product;
    let currentCategory = originalData?.product?.category;
    
    // Handle case where category is just an ID string - look it up from API categories
    if (typeof currentCategory === 'string' && apiCategories.length > 0) {
        currentCategory = apiCategories.find(cat => cat.id === currentCategory);
    }
    
    // Also check if it's an object with just an id but we need to look up the full details
    if (currentCategory && typeof currentCategory === 'object' && currentCategory.id && !currentCategory.name && apiCategories.length > 0) {
        const fullCategory = apiCategories.find(cat => cat.id === currentCategory.id);
        if (fullCategory) {
            currentCategory = fullCategory;
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-navy-900/50 via-navy-900 to-navy-900/50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/products")}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                                title="Back to products"
                            >
                                <ChevronLeft className="w-5 h-5 text-neutral-400" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Edit Product</h1>
                                <p className="text-neutral-400 text-sm mt-0.5">{product?.name}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/products")}
                            className="hidden sm:inline-flex"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Overview Card */}
                    {product && (
                        <Card className="p-6 bg-gradient-to-br from-white/5 to-white/0 border-white/10 hover:border-white/20 transition">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                {/* Product Image */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                    {media && media.length > 0 && media.find(m => m.is_primary) ? (
                                        <img
                                            src={media.find(m => m.is_primary)?.url}
                                            alt={product?.name}
                                            className="w-full h-full object-cover rounded-xl bg-white/10 border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                            <Image className="w-10 h-10 text-neutral-600" strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-lg">{product?.name}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-sm">
                                            <span className="text-neutral-500">Brand:</span>
                                            <span className="text-neutral-300 font-medium">{product?.brand || "—"}</span>
                                        </div>
                                        <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <span className="text-neutral-500">Unit:</span>
                                            <span className="text-neutral-300 font-medium">{product?.unit || "—"}</span>
                                        </div>
                                        {currentCategory && (
                                            <>
                                                <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
                                                <div className="group flex items-center gap-1 text-sm relative">
                                                    <span className="text-neutral-500">Category:</span>
                                                    <span className="text-orange-400 font-medium cursor-help">
                                                        {currentCategory?.name || (typeof currentCategory === 'string' ? currentCategory : 'Unknown Category')}
                                                    </span>
                                                    {currentCategory?.description && (
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded py-2 px-3 whitespace-normal max-w-xs z-20">
                                                            {currentCategory.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {product?.description && (
                                        <p className="text-neutral-400 text-sm mt-3 line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: product?.description?.substring(0, 120) }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Grid Layout for better organization */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Takes 2/3 width on large screens */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Image Management Section */}
                            {product && (
                                <Card className="p-6 border-white/10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Image className="w-5 h-5 text-orange-400" />
                                        <h3 className="font-semibold text-white text-lg">Product Images</h3>
                                    </div>

                                    {media && media.length > 0 ? (
                                        <div className="space-y-4 mb-6">
                                            {media.map((image) => (
                                                <div
                                                    key={image.id}
                                                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition group"
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt_text || "Product image"}
                                                        className="w-20 h-20 object-cover rounded-lg bg-white/10 flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="space-y-3">
                                                            <Input
                                                                label="Alt Text"
                                                                type="text"
                                                                value={image.alt_text || ""}
                                                                onChange={(e) => {
                                                                    setMedia(
                                                                        media.map((m) =>
                                                                            m.id === image.id
                                                                                ? { ...m, alt_text: e.target.value }
                                                                                : m
                                                                        )
                                                                    );
                                                                }}
                                                                onBlur={() => {
                                                                    handleMediaUpdate(image.id, {
                                                                        alt_text: image.alt_text,
                                                                    });
                                                                }}
                                                                placeholder="Description for accessibility..."
                                                                maxLength="255"
                                                            />
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={image.is_primary || false}
                                                                    onChange={(e) => {
                                                                        handleMediaUpdate(image.id, {
                                                                            is_primary: e.target.checked,
                                                                        });
                                                                    }}
                                                                    disabled={mediaUpdating[image.id]}
                                                                    className="w-4 h-4 cursor-pointer rounded"
                                                                />
                                                                <span className="text-sm text-neutral-300">
                                                                    {image.is_primary ? "✓ Primary image" : "Set as primary"}
                                                                </span>
                                                                {mediaUpdating[image.id] && (
                                                                    <span className="text-xs text-neutral-500 ml-auto">Updating...</span>
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => handleMediaDelete(image.id)}
                                                        disabled={mediaUpdating[image.id]}
                                                        className="border-red-400/30 text-red-300 hover:bg-red-400/10 flex-shrink-0"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-neutral-400 mb-6">
                                            <Image className="w-12 h-12 text-neutral-600 mx-auto mb-2 opacity-50" />
                                            <p>No images available</p>
                                        </div>
                                    )}

                                    {/* Upload Section */}
                                    <div className="pt-6 border-t border-white/10">
                                        <h4 className="font-medium text-white mb-4">Upload New Images</h4>
                                        <div className="space-y-4">
                                            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-orange-400/50 transition">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer block">
                                                    <Image className="w-12 h-12 text-neutral-500 mx-auto mb-3" strokeWidth={1} />
                                                    <p className="font-medium text-white">
                                                        {selectedFiles.length > 0 
                                                            ? `${selectedFiles.length} image${selectedFiles.length !== 1 ? 's' : ''} selected` 
                                                            : "Click to upload or drag & drop"}
                                                    </p>
                                                    <p className="text-sm text-neutral-400 mt-1">
                                                        PNG, JPG, GIF, WebP • Max 5MB each
                                                    </p>
                                                </label>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedFiles([]);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = "";
                                                        }
                                                    }}
                                                    disabled={selectedFiles.length === 0 || uploadingImage}
                                                >
                                                    Clear
                                                </Button>
                                                <Button
                                                    className="bg-orange-400 hover:bg-orange-500 text-white"
                                                    type="button"
                                                    onClick={handleImageUpload}
                                                    disabled={selectedFiles.length < 1 || uploadingImage}
                                                >
                                                    {uploadingImage ? `Uploading...` : `Upload (${selectedFiles.length})`}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Pricing & Inventory Section */}
                            <Card className="p-6 border-white/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <Package className="w-5 h-5 text-orange-400" />
                                    <h3 className="font-semibold text-white text-lg">Pricing &amp; Inventory</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Selling Price (£)"
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => updateForm({ price: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Compare at Price (£)"
                                        type="number"
                                        step="0.01"
                                        value={form.compare_at_price}
                                        onChange={(e) => updateForm({ compare_at_price: e.target.value })}
                                    />
                                    <Input
                                        label="Stock Quantity"
                                        type="number"
                                        value={form.stock_qty}
                                        onChange={(e) => updateForm({ stock_qty: e.target.value })}
                                        readOnly
                                        className="opacity-75"
                                    />
                                    <Input
                                        label="Reorder Threshold"
                                        type="number"
                                        value={form.reorder_threshold}
                                        onChange={(e) => updateForm({ reorder_threshold: e.target.value })}
                                    />
                                </div>
                            </Card>

                            {/* Product Details Section */}
                            <Card className="p-6 border-white/10 mb-20">
                                <div className="flex items-center gap-2 mb-6">
                                    <Tag className="w-5 h-5 text-orange-400" />
                                    <h3 className="font-semibold text-white text-lg">Product Details</h3>
                                </div>

                                {/* Category Information */}
                                {currentCategory && (
                                    <div className="mb-6 p-4 bg-orange-400/5 border border-orange-400/20 rounded-lg">
                                        <p className="text-sm text-neutral-400 mb-2">Product Category</p>
                                        <p className="text-lg font-semibold text-white mb-2">
                                            {currentCategory?.name || (typeof currentCategory === 'string' ? `ID: ${currentCategory}` : 'Uncategorized')}
                                        </p>
                                        {currentCategory?.description && (
                                            <p className="text-sm text-neutral-300 mb-3">{currentCategory.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            {currentCategory?.slug && (
                                                <div>
                                                    <span className="text-neutral-500">Slug:</span>
                                                    <span className="text-neutral-300 ml-1 font-mono">{currentCategory.slug}</span>
                                                </div>
                                            )}
                                            {currentCategory?.id && (
                                                <div>
                                                    <span className="text-neutral-500">ID:</span>
                                                    <span className="text-neutral-300 ml-1 font-mono text-[10px]">{currentCategory.id.substring(0, 8)}...</span>
                                                </div>
                                            )}
                                            {currentCategory?.is_active !== undefined && (
                                                <div>
                                                    <span className="text-neutral-500">Status:</span>
                                                    <span className={`ml-1 font-medium ${currentCategory.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                                        {currentCategory.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex gap-2">
                                        <Input
                                            label="SKU"
                                            type="text"
                                            value={form.sku}
                                            onChange={(e) => updateForm({ sku: e.target.value })}
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            title="Regenerate SKU"
                                            onClick={() => updateForm({ sku: generateSku() })}
                                            className="shrink-0 mt-6 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <Input
                                        label="Barcode"
                                        type="text"
                                        value={form.barcode}
                                        onChange={(e) => updateForm({ barcode: e.target.value })}
                                    />
                                    <Input
                                        label="Weight (kg)"
                                        type="number"
                                        step="0.01"
                                        value={form.weight}
                                        onChange={(e) => updateForm({ weight: e.target.value })}
                                    />
                                    <div className="flex flex-col justify-end">
                                        <label className="mb-2 text-sm font-medium text-neutral-200">Status</label>
                                        <ToggleButtonGroup
                                            options={[
                                                { label: "Active", value: "active" },
                                                { label: "Inactive", value: "inactive" },
                                            ]}
                                            value={form.status}
                                            onChange={(val) => updateForm({ status: val })}
                                            name="status"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Variant Options */}
                            {form.variant_options && (
                                <Card className="p-6 border-white/10 bg-white/[0.03]">
                                    <h3 className="font-semibold text-white mb-4">Variant Options</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Size"
                                            type="text"
                                            value={form.variant_options.size || ""}
                                            onChange={(e) =>
                                                updateForm({
                                                    variant_options: {
                                                        ...form.variant_options,
                                                        size: e.target.value,
                                                    },
                                                })
                                            }
                                            placeholder="S, M, L, XL..."
                                        />
                                        <Input
                                            label="Color"
                                            type="text"
                                            value={form.variant_options.color || ""}
                                            onChange={(e) =>
                                                updateForm({
                                                    variant_options: {
                                                        ...form.variant_options,
                                                        color: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar - Takes 1/3 width on large screens */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Store-Specific Section */}
                            <Card className="p-6 border-white/10 sticky top-24">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                    <h3 className="font-semibold text-white">Store Info</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-medium text-neutral-200">Notes</label>
                                            <span className={`text-xs font-medium ${(form.store_notes || "").length > 500
                                                ? "text-red-400"
                                                : "text-neutral-500"
                                                }`}>
                                                {(form.store_notes || "").length}/500
                                            </span>
                                        </div>
                                        <Textarea
                                            rows={4}
                                            value={form.store_notes || ""}
                                            onChange={(e) => updateForm({ store_notes: e.target.value.slice(0, 500) })}
                                            placeholder="Internal notes..."
                                            maxLength="500"
                                        />
                                    </div>

                                    <div ref={storeTagDropdownRef} className="relative">
                                        <label className="block text-sm font-medium text-neutral-200 mb-2">
                                            Store Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white/5 rounded-lg min-h-10">
                                            {form.store_specific_tags.length > 0 ? (
                                                form.store_specific_tags.map((tag, index) => (
                                                    <span
                                                        key={`${tag}-${index}`}
                                                        className="px-2 py-1 bg-orange-500/20 border border-orange-400/50 text-orange-300 text-xs rounded-full flex items-center gap-1"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(index)}
                                                            className="text-orange-300 hover:text-orange-200"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-neutral-500 self-center">No tags added</span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={storeTagSearch}
                                                onChange={(e) => {
                                                    setStoreTagSearch(e.target.value);
                                                    setShowStoreTagDropdown(true);
                                                }}
                                                onFocus={() => setShowStoreTagDropdown(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && storeTagSearch.trim()) {
                                                        e.preventDefault();
                                                        const exactMatch = filteredStoreTags.find(
                                                            (t) => t.name.toLowerCase() === storeTagSearch.toLowerCase()
                                                        );
                                                        if (exactMatch) {
                                                            updateForm({
                                                                store_specific_tags: [...form.store_specific_tags, exactMatch.name],
                                                            });
                                                        } else {
                                                            updateForm({
                                                                store_specific_tags: [...form.store_specific_tags, storeTagSearch.trim()],
                                                            });
                                                        }
                                                        setStoreTagSearch("");
                                                        setShowStoreTagDropdown(false);
                                                    }
                                                }}
                                                placeholder="Add tags..."
                                                className="w-full border border-white/20 px-3 py-2 text-sm bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-400/50 rounded-lg text-white placeholder-neutral-500"
                                            />
                                            {showStoreTagDropdown && (storeTagSearch || filteredStoreTags.length > 0) && (
                                                <div className="absolute z-10 w-full mt-2 bg-navy-800 border border-white/10 shadow-lg max-h-48 overflow-y-auto rounded-lg">
                                                    {filteredStoreTags.slice(0, 8).map((tag) => (
                                                        <button
                                                            key={tag.id}
                                                            type="button"
                                                            onClick={() => {
                                                                updateForm({
                                                                    store_specific_tags: [...form.store_specific_tags, tag.name],
                                                                });
                                                                setStoreTagSearch("");
                                                                setShowStoreTagDropdown(false);
                                                            }}
                                                            className="w-full text-left px-3 py-2 hover:bg-orange-400/10 text-sm text-neutral-300 transition"
                                                        >
                                                            <span>{tag.name}</span>
                                                        </button>
                                                    ))}
                                                    {storeTagSearch.trim() &&
                                                        !apiTags.some(
                                                            (t) => t.name.toLowerCase() === storeTagSearch.toLowerCase()
                                                        ) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    updateForm({
                                                                        store_specific_tags: [...form.store_specific_tags, storeTagSearch.trim()],
                                                                    });
                                                                    setStoreTagSearch("");
                                                                    setShowStoreTagDropdown(false);
                                                                }}
                                                                className="w-full text-left px-3 py-2 hover:bg-green-400/10 text-sm border-t border-white/10 text-green-400 font-medium transition"
                                                            >
                                                                + Add: "{storeTagSearch.trim()}"
                                                            </button>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Action Buttons - Hidden, moved to footer */}
                            <div className="hidden"></div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sticky Action Bar - Desktop & Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-navy-900 via-navy-900 to-navy-900/80 backdrop-blur border-t border-white/10 p-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 lg:gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/products")}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 lg:flex-none lg:px-8 bg-orange-400 hover:bg-orange-500 text-white"
                    >
                        {isSaving ? "Saving..." : "Update Product"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
