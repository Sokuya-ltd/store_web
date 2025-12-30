import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import storeProductsData from "../../dataset/store_products.json";
import productsData from "../../dataset/products.json";
import tagsData from "../../dataset/tags.json";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [storeTagSearch, setStoreTagSearch] = useState("");
    const [showStoreTagDropdown, setShowStoreTagDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const storeTagDropdownRef = useRef(null);

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
        variant_options: {
            size: "",
            color: "",
        },
        weight: "",
        store_specific_tags: [],
        store_notes: "",
        // Embedded category object (matches store_products.json structure)
        category: null,
        // Product fields
        product: {
            id: "",
            name: "",
            slug: "",
            description: "",
            image_url: "",
            unit: "kg",
            category_id: "",
            brand: "",
            ingredients: "",
            recommended_price: "",
            tags: [],
            is_active: true,
        },
    });

    // Original store product data (for tracking changes)
    const [originalData, setOriginalData] = useState(null);

    // State for suggested category (when category not in list)
    const [suggestedCategory, setSuggestedCategory] = useState("");

    // Load product data on mount
    useEffect(() => {
        const loadProduct = () => {
            // Find store product by ID
            const storeProduct = storeProductsData.store_products.find(
                (sp) => sp.id === id
            );

            if (!storeProduct) {
                setError("Product not found");
                setIsLoading(false);
                return;
            }

            // Store original data for comparison
            setOriginalData(storeProduct);

            // Populate form with existing data
            setForm({
                price: storeProduct.price?.toString() || "",
                compare_at_price: storeProduct.compare_at_price?.toString() || "",
                stock_qty: storeProduct.stock_qty?.toString() || "",
                stock_reserved: storeProduct.stock_reserved || 0,
                reorder_threshold: storeProduct.reorder_threshold || 5,
                sku: storeProduct.sku || "",
                barcode: storeProduct.barcode || "",
                status: storeProduct.status || "active",
                variant_options: storeProduct.variant_options || { size: "", color: "" },
                weight: storeProduct.weight?.toString() || "",
                store_specific_tags: storeProduct.store_specific_tags || [],
                store_notes: storeProduct.store_notes || "",
                category: storeProduct.category || null,
                product: {
                    id: storeProduct.product?.id || "",
                    name: storeProduct.product?.name || "",
                    slug: storeProduct.product?.slug || "",
                    description: storeProduct.product?.description || "",
                    image_url: storeProduct.product?.image_url || "",
                    unit: storeProduct.product?.unit || "kg",
                    category_id: storeProduct.product?.category_id || "",
                    brand: storeProduct.product?.brand || "",
                    ingredients: storeProduct.product?.ingredients || "",
                    recommended_price: storeProduct.product?.recommended_price?.toString() || "",
                    tags: storeProduct.product?.tags || [],
                    is_active: storeProduct.product?.is_active ?? true,
                },
            });

            // Set search query to product name
            setSearchQuery(storeProduct.product?.name || "");

            // Check for suggested category
            if (storeProduct.product?.suggested_category) {
                setSuggestedCategory(storeProduct.product.suggested_category);
            }

            setIsLoading(false);
        };

        loadProduct();
    }, [id]);

    // Filter products based on search query
    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter store tags based on search and exclude already selected
    const filteredStoreTags = useMemo(() => {
        const selectedTags = form.store_specific_tags || [];
        return tagsData.tags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(storeTagSearch.toLowerCase()) &&
                !selectedTags.includes(tag.name)
        );
    }, [storeTagSearch, form.store_specific_tags]);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (storeTagDropdownRef.current && !storeTagDropdownRef.current.contains(event.target)) {
                setShowStoreTagDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectProduct = (product) => {
        setSearchQuery(product.name);
        const categoryId = product.category_id;
        const foundCategory = flattenedCategories.find((c) => c.id === categoryId);
        const embeddedCategory = foundCategory
            ? {
                id: foundCategory.id,
                name: foundCategory.name,
                slug: foundCategory.id,
                parent_id: foundCategory.isParent ? null : foundCategory.id.split('-').slice(0, 2).join('-'),
                parent_name: foundCategory.parentName || null,
            }
            : null;

        setForm({
            ...form,
            category: embeddedCategory,
            product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                image_url: product.image_url,
                unit: product.unit,
                category_id: product.category_id,
                brand: product.brand,
                ingredients: product.ingredients,
                recommended_price: product.recommended_price,
                tags: product.tags || [],
                is_active: product.is_active,
            },
        });
        setSuggestedCategory("");
        setShowDropdown(false);
    };

    const updateForm = (updates) => {
        setForm({ ...form, ...updates });
    };

    const updateProduct = (updates) => {
        setForm({ ...form, product: { ...form.product, ...updates } });
    };

    const removeTag = (index, type) => {
        if (type === "product") {
            const newTags = form.product.tags.filter((_, i) => i !== index);
            updateProduct({ tags: newTags });
        } else {
            const newTags = form.store_specific_tags.filter((_, i) => i !== index);
            updateForm({ store_specific_tags: newTags });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation
        if (!form.product.name) {
            alert("Please select a product");
            return;
        }
        if (!form.price || !form.stock_qty) {
            alert("Please fill in price and stock quantity");
            return;
        }

        // Use existing product ID
        const productId = form.product.id;

        // Build the updated store product object
        const updatedStoreProduct = {
            id: id, // Keep original store product ID
            store_id: originalData?.store_id || "550e8400-e29b-41d4-a716-446655440001",
            product_id: productId,
            price: parseFloat(form.price),
            compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
            stock_qty: parseInt(form.stock_qty),
            stock_reserved: parseInt(form.stock_reserved) || 0,
            reorder_threshold: parseInt(form.reorder_threshold) || 5,
            sku: form.sku,
            barcode: form.barcode,
            status: form.status,
            variant_options: form.variant_options,
            weight: form.weight ? parseFloat(form.weight) : null,
            store_specific_tags: form.store_specific_tags,
            store_notes: form.store_notes,
            // Embedded product object
            product: {
                ...form.product,
                id: productId,
                recommended_price: form.product.recommended_price
                    ? parseFloat(form.product.recommended_price)
                    : null,
                ...(suggestedCategory && { suggested_category: suggestedCategory }),
            },
            // Embedded category object
            category: form.category || {
                id: "cat-other-001",
                name: "Uncategorized",
                slug: "uncategorized",
                parent_id: "cat-other",
                parent_name: "Other",
            },
        };

        // TODO: Save to API
        alert("Product updated successfully!");
        navigate("/products");
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
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Product Not Found</h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <Button onClick={() => navigate("/products")}>
                            Back to Products
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Edit Product</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Editing: {form.product.name}
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
                {/* Product Selection */}
                <Card className="p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Product Selection</h3>
                    <div className="relative" ref={dropdownRef}>
                        <Input
                            label="Search or Change Product"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Type to search products..."
                        />
                        {showDropdown && searchQuery && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.slice(0, 10).map((product) => (
                                        <div
                                            key={product.id}
                                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-8 h-8 object-cover bg-slate-100"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-500">{product.brand}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-500">
                                        No products found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {form.product.name && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                            <img
                                src={form.product.image_url}
                                alt={form.product.name}
                                className="w-16 h-16 object-cover bg-slate-200"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">{form.product.name}</p>
                                <p className="text-sm text-slate-500">{form.product.brand} • {form.product.unit}</p>
                                <p className="text-xs text-slate-400 mt-1">{form.product.description}</p>
                            </div>
                            {form.category && (
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Category</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {form.category.parent_name ? `${form.category.parent_name} > ` : ""}
                                        {form.category.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

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
                            required
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
                                    <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                        Stock Keeping Unit - a unique alphanumeric code assigned to a specific product
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

                {/* Variants */}
                <Card className="p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Variant Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Size"
                            type="text"
                            value={form.variant_options.size}
                            onChange={(e) =>
                                updateForm({
                                    variant_options: { ...form.variant_options, size: e.target.value },
                                })
                            }
                            placeholder="S, M, L, XL, etc."
                        />
                        <Input
                            label="Color"
                            type="text"
                            value={form.variant_options.color}
                            onChange={(e) =>
                                updateForm({
                                    variant_options: { ...form.variant_options, color: e.target.value },
                                })
                            }
                        />
                    </div>
                </Card>

                {/* Store Notes & Tags */}
                <Card className="p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Store-Specific Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea
                            label="Store Notes"
                            rows={3}
                            value={form.store_notes}
                            onChange={(e) => updateForm({ store_notes: e.target.value })}
                            placeholder="Internal notes about this product..."
                        />
                        <div ref={storeTagDropdownRef}>
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
                                            onClick={() => removeTag(index, "store")}
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
                                    className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70"
                                />
                                {showStoreTagDropdown && (storeTagSearch || filteredStoreTags.length > 0) && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 shadow-lg max-h-48 overflow-y-auto">
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
                                                <span className="text-xs text-slate-400">{tag.category}</span>
                                            </button>
                                        ))}
                                        {storeTagSearch.trim() &&
                                            !tagsData.tags.some(
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
                    <Button type="submit">Update Product</Button>
                </div>
            </form>
        </div>
    );
}
