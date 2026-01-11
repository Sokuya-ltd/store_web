import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

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
    const [selectedFile, setSelectedFile] = useState(null);
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

            await api.put(`/store/${product_id}/media/${mediaId}`, updates);

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

    // Handle image upload
    const handleImageUpload = async () => {
        console.log("Uploading image for product_id:", product_id);
        const notifyUser = (message, type = "error") => {
            if (typeof addToast === "function") {
                try { addToast(message, type); } catch (e) { console.error("Toast error:", e); }
            } else {
                console.error("Toast unavailable:", message);
            }
        };

        if (!selectedFile) {
            notifyUser("Please select an image to upload", "error");
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
        if (!allowedTypes.includes(selectedFile.type)) {
            notifyUser("Only image files (JPG, PNG, GIF, WebP, TIFF, SVG, BMP, ICO, AVIF, HEIC) are allowed", "error");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            notifyUser("File size must be less than 5MB", "error");
            return;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await api.uploadFile(
                `/store/products/${id}/media`,
                formData
            );

            if (response) {
                setMedia([...media, response]);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                notifyUser("Image uploaded successfully", "success");
            }
        } catch (err) {
            notifyUser(err.message || "Failed to upload image", "error");
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
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full space-y-6 py-6">
                <Card className="p-6">
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {error === "Product not found" ? "Product Not Found" : "Error Loading Product"}
                        </h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <Button onClick={() => navigate("/products")}>
                            Back to Products
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const product = originalData?.product;
    const currentCategory = originalData?.product?.category;

    return (
        <div className="w-full space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Edit Product</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {product?.name}
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/products")}
                >
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {product && (
                    <Card className="p-6">
                        <h3 className="font-medium text-slate-900 mb-4">Product Information</h3>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                            {product?.image_url ? (
                                <img
                                    src={product?.image_url}
                                    alt={product?.name}
                                    className="w-20 h-20 object-cover rounded bg-slate-200"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-slate-200 rounded flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">{product?.name}</p>
                                <p className="text-sm text-slate-600 mt-1">
                                    {product?.brand} • {product?.unit}
                                </p>
                                <div className="text-sm text-slate-500 mt-2 relative group">
                                    <p className="truncate" dangerouslySetInnerHTML={{ __html: product?.description?.substring(0, 50) }}></p>
                                    {product?.description?.length > 50 && (
                                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-slate-900 text-white text-xs rounded py-2 px-3 whitespace-normal max-w-xs z-10"
                                            dangerouslySetInnerHTML={{ __html: product?.description }}
                                        />
                                    )}
                                </div>
                            </div>
                            {currentCategory && (
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase">Category</p>
                                    <p className="text-sm font-medium text-slate-700 mt-1">
                                        {currentCategory.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Image Management */}
                {product && (
                    <Card className="p-6">
                        <h3 className="font-medium text-slate-900 mb-4">Image Management</h3>
                        {media && media.length > 0 ? (
                            <div className="space-y-4">
                                {media.map((image) => (
                                    <div
                                        key={image.id}
                                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt_text || "Product image"}
                                            className="w-24 h-24 object-cover rounded bg-slate-200"
                                        />
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <div className="flex items-end gap-2">
                                                    <div className="flex-1">
                                                        <label className="text-sm font-medium text-slate-700 block mb-2">
                                                            Primary Image
                                                        </label>
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
                                                                className="w-4 h-4 cursor-pointer"
                                                            />
                                                            <span className="text-sm text-slate-600">
                                                                {image.is_primary ? "Primary image" : "Set as primary"}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    {mediaUpdating[image.id] && (
                                                        <div className="text-xs text-slate-500">Updating...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <p>No images available for this product</p>
                            </div>
                        )}

                        {/* Image Upload Form */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <h4 className="font-medium text-slate-900 mb-4">Upload New Image</h4>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer block">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg
                                                className="w-12 h-12 text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    PNG, JPG, GIF, WebP • Max 5MB
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        disabled={!selectedFile || uploadingImage}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleImageUpload}
                                        disabled={!selectedFile || uploadingImage}
                                    >
                                        {uploadingImage ? "Uploading..." : "Upload Image"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Store Product Details */}
                <Card className="p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        />
                        <Input
                            label="Reorder Threshold"
                            type="number"
                            value={form.reorder_threshold}
                            onChange={(e) => updateForm({ reorder_threshold: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="relative group">
                            <div className="flex items-center gap-1 mb-1">
                                <label className="text-sm font-medium text-slate-700">SKU</label>
                                <span className="relative">
                                    <svg
                                        className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                        Stock Keeping Unit - a unique code for this product
                                    </div>
                                </span>
                            </div>
                            <Input
                                type="text"
                                value={form.sku}
                                onChange={(e) => updateForm({ sku: e.target.value })}
                            />
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
                            <label className="mb-1 text-sm font-medium text-slate-700">Status</label>
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
                    <Card className="p-6">
                        <h3 className="font-medium text-slate-900 mb-4">Variant Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder="S, M, L, XL, etc."
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

                {/* Store Notes & Tags */}
                <Card className="p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Store-Specific Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-700">Store Notes</label>
                                <span className={`text-xs ${(form.store_notes || "").length > 500
                                    ? "text-red-600 font-medium"
                                    : "text-slate-500"
                                    }`}>
                                    {(form.store_notes || "").length}/500
                                </span>
                            </div>
                            <Textarea
                                rows={3}
                                value={form.store_notes || ""}
                                onChange={(e) => updateForm({ store_notes: e.target.value.slice(0, 500) })}
                                placeholder="Internal notes about this product..."
                                maxLength="500"
                            />
                        </div>
                        <div ref={storeTagDropdownRef} className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Store-Specific Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.store_specific_tags.map((tag, index) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="text-orange-400 hover:text-orange-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
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
                                    placeholder="Search or type to add tags..."
                                    className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 rounded"
                                />
                                {showStoreTagDropdown && (storeTagSearch || filteredStoreTags.length > 0) && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 shadow-lg max-h-48 overflow-y-auto rounded">
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
                                                className="w-full text-left px-3 py-2 hover:bg-orange-50 text-sm flex items-center justify-between"
                                            >
                                                <span>{tag.name}</span>
                                                <span className="text-xs text-slate-400">{tag.slug}</span>
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
                                                    className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm border-t border-slate-200 text-green-700 font-medium"
                                                >
                                                    + Add custom tag: "{storeTagSearch.trim()}"
                                                </button>
                                            )}
                                        {filteredStoreTags.length === 0 && !storeTagSearch.trim() && (
                                            <div className="px-3 py-2 text-sm text-slate-500">
                                                All tags already added
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Select from suggestions or type and press Enter to add custom tags
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/products")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Update Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
