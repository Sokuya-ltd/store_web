import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import productsData from "../../dataset/products.json";
import categoriesData from "../../dataset/categories.json";
import tagsData from "../../dataset/tags.json";

export default function ProductAdd() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [storeTagSearch, setStoreTagSearch] = useState("");
    const [showStoreTagDropdown, setShowStoreTagDropdown] = useState(false);
    const [productTagSearch, setProductTagSearch] = useState("");
    const [showProductTagDropdown, setShowProductTagDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const storeTagDropdownRef = useRef(null);
    const productTagDropdownRef = useRef(null);

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
        // Product fields (only required if creating new product)
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

    // State for suggested category (when category not in list)
    const [suggestedCategory, setSuggestedCategory] = useState("");

    // Flatten categories for searchable dropdown
    const flattenedCategories = useMemo(() => {
        const result = [];
        categoriesData.categories.forEach((parent) => {
            // Add parent category
            result.push({
                id: parent.id,
                name: parent.name,
                displayName: parent.name,
                isParent: true,
            });
            // Add subcategories with parent name prefix
            if (parent.subcategories) {
                parent.subcategories.forEach((sub) => {
                    result.push({
                        id: sub.id,
                        name: sub.name,
                        displayName: `${parent.name} > ${sub.name}`,
                        parentName: parent.name,
                        isParent: false,
                    });
                });
            }
        });
        return result;
    }, []);

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!categorySearch) return flattenedCategories;
        const query = categorySearch.toLowerCase();
        return flattenedCategories.filter(
            (cat) =>
                cat.name.toLowerCase().includes(query) ||
                cat.displayName.toLowerCase().includes(query)
        );
    }, [categorySearch, flattenedCategories]);

    // Get selected category display name
    const selectedCategoryName = useMemo(() => {
        // If there's a suggested category, show it with a special indicator
        if (suggestedCategory) {
            return `✨ ${suggestedCategory} (Suggested)`;
        }
        if (!form.category) return "";
        // Build display name from embedded category
        if (form.category.parent_name) {
            return `${form.category.parent_name} > ${form.category.name}`;
        }
        return form.category.name;
    }, [form.category, suggestedCategory]);

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

    // Filter product tags based on search and exclude already selected
    const filteredProductTags = useMemo(() => {
        const selectedTags = form.product.tags || [];
        return tagsData.tags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(productTagSearch.toLowerCase()) &&
                !selectedTags.includes(tag.name)
        );
    }, [productTagSearch, form.product.tags]);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
            if (storeTagDropdownRef.current && !storeTagDropdownRef.current.contains(event.target)) {
                setShowStoreTagDropdown(false);
            }
            if (productTagDropdownRef.current && !productTagDropdownRef.current.contains(event.target)) {
                setShowProductTagDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle category selection
    const handleSelectCategory = (category) => {
        // Build the embedded category object matching store_products.json structure
        const embeddedCategory = {
            id: category.id,
            name: category.name,
            slug: category.id, // Use id as slug for now
            parent_id: category.isParent ? null : category.id.split('-').slice(0, 2).join('-'),
            parent_name: category.parentName || null,
        };
        updateForm({ category: embeddedCategory });
        updateProduct({ category_id: category.id });
        setSuggestedCategory("");
        setCategorySearch("");
        setShowCategoryDropdown(false);
    };

    // Handle suggesting a new category
    const handleSuggestCategory = () => {
        if (categorySearch.trim()) {
            // Use "Other > Uncategorized" as fallback with suggested name
            const fallbackCategory = {
                id: "cat-other-001",
                name: "Uncategorized",
                slug: "uncategorized",
                parent_id: "cat-other",
                parent_name: "Other",
            };
            updateForm({ category: fallbackCategory });
            updateProduct({ category_id: "cat-other-001" });
            setSuggestedCategory(categorySearch.trim());
            setCategorySearch("");
            setShowCategoryDropdown(false);
        }
    };

    const handleSelectProduct = (product) => {
        setSearchQuery(product.name);
        // Find and embed the category object
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
        setIsNewProduct(false);
        setShowDropdown(false);
    };

    const handleCreateNew = () => {
        setIsNewProduct(true);
        setForm({
            ...form,
            category: null, // Reset category for new product
            product: {
                ...form.product,
                id: "",
                name: searchQuery,
                slug: searchQuery.toLowerCase().replace(/\s+/g, "-"),
                category_id: "",
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
            alert("Please select or create a product");
            return;
        }
        if (!form.price || !form.stock_qty) {
            alert("Please fill in price and stock quantity");
            return;
        }

        // Generate IDs for new entries
        const storeProductId = crypto.randomUUID();
        const productId = isNewProduct ? crypto.randomUUID() : form.product.id;

        // Build the final store product object matching store_products.json structure
        const storeProduct = {
            id: storeProductId,
            store_id: "550e8400-e29b-41d4-a716-446655440001", // Current store ID
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
                // Include suggested category in product notes if provided
                ...(suggestedCategory && { suggested_category: suggestedCategory }),
            },
            // Embedded category object (new structure)
            category: form.category || {
                id: "cat-other-001",
                name: "Uncategorized",
                slug: "uncategorized",
                parent_id: "cat-other",
                parent_name: "Other",
            },
        };

        console.log("Store Product to save:", storeProduct);
        // TODO: Save to API
        alert("Product added successfully!");
        navigate("/products");
    };

    return (
        <div className="w-full space-y-6 py-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add New Product</h2>
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
                            label="Search or Create Product"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                                if (e.target.value !== form.product.name) {
                                    setIsNewProduct(false);
                                    updateProduct({ id: "", name: "" });
                                }
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Type to search products..."
                        />
                        {showDropdown && searchQuery && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredProducts.length > 0 ? (
                                    <>
                                        {filteredProducts.slice(0, 10).map((product) => (
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
                                        ))}
                                        <div
                                            className="px-4 py-3 border-t border-slate-100 hover:bg-orange-50 cursor-pointer text-orange-600 font-medium text-sm"
                                            onClick={handleCreateNew}
                                        >
                                            + Create new product "{searchQuery}"
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-orange-600 font-medium text-sm"
                                        onClick={handleCreateNew}
                                    >
                                        + Create new product "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {form.product.name && !isNewProduct && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                            <img
                                src={form.product.image_url}
                                alt={form.product.name}
                                className="w-16 h-16 object-cover bg-slate-200"
                            />
                            <div>
                                <p className="font-medium text-slate-900">{form.product.name}</p>
                                <p className="text-sm text-slate-500">{form.product.brand} • {form.product.unit}</p>
                                <p className="text-xs text-slate-400 mt-1">{form.product.description}</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* New Product Details (only shown when creating new product) */}
                {isNewProduct && (
                    <Card className="p-6">
                        <h3 className="font-medium text-slate-900 mb-4">New Product Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Product Name"
                                type="text"
                                value={form.product.name}
                                onChange={(e) => {
                                    updateProduct({
                                        name: e.target.value,
                                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                                    });
                                    setSearchQuery(e.target.value);
                                }}
                                required
                            />
                            <Input
                                label="Brand"
                                type="text"
                                value={form.product.brand}
                                onChange={(e) => updateProduct({ brand: e.target.value })}
                            />
                            <div className="relative" ref={categoryDropdownRef}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Category
                                </label>
                                <div
                                    className="w-full border border-slate-300 px-3 py-2 text-sm cursor-pointer bg-white flex items-center justify-between"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                >
                                    <span className={selectedCategoryName ? "text-slate-900" : "text-slate-400"}>
                                        {selectedCategoryName || "Select category..."}
                                    </span>
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {showCategoryDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
                                        <div className="p-2 border-b border-slate-100">
                                            <input
                                                type="text"
                                                value={categorySearch}
                                                onChange={(e) => setCategorySearch(e.target.value)}
                                                placeholder="Search categories..."
                                                className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 rounded"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {filteredCategories.length > 0 ? (
                                                <>
                                                    {filteredCategories.map((category) => (
                                                        <div
                                                            key={category.id}
                                                            className={`px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm ${category.isParent ? "font-medium text-slate-900" : "text-slate-700 pl-6"
                                                                } ${form.product.category_id === category.id ? "bg-orange-50 text-orange-600" : ""}`}
                                                            onClick={() => handleSelectCategory(category)}
                                                        >
                                                            {category.isParent ? category.name : `↳ ${category.name}`}
                                                        </div>
                                                    ))}
                                                    {categorySearch.trim() && (
                                                        <div
                                                            className="px-4 py-3 border-t border-slate-100 hover:bg-orange-50 cursor-pointer text-orange-600 font-medium text-sm"
                                                            onClick={handleSuggestCategory}
                                                        >
                                                            ✨ Suggest new category: "{categorySearch}"
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="px-4 py-3 text-sm text-slate-500">
                                                        No categories found
                                                    </div>
                                                    {categorySearch.trim() && (
                                                        <div
                                                            className="px-4 py-3 border-t border-slate-100 hover:bg-orange-50 cursor-pointer text-orange-600 font-medium text-sm"
                                                            onClick={handleSuggestCategory}
                                                        >
                                                            ✨ Suggest new category: "{categorySearch}"
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Input
                                label="Unit"
                                type="text"
                                value={form.product.unit}
                                onChange={(e) => updateProduct({ unit: e.target.value })}
                                placeholder="kg, liter, piece, etc."
                            />
                            <Input
                                label="Recommended Price (£)"
                                type="number"
                                step="0.01"
                                value={form.product.recommended_price}
                                onChange={(e) => updateProduct({ recommended_price: e.target.value })}
                            />
                            <Input
                                label="Image URL"
                                type="url"
                                value={form.product.image_url}
                                onChange={(e) => updateProduct({ image_url: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Textarea
                                label="Description"
                                rows={3}
                                value={form.product.description}
                                onChange={(e) => updateProduct({ description: e.target.value })}
                            />
                            <Textarea
                                label="Ingredients"
                                rows={3}
                                value={form.product.ingredients}
                                onChange={(e) => updateProduct({ ingredients: e.target.value })}
                            />
                        </div>
                        <div className="mt-4" ref={productTagDropdownRef}>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Product Tags
                            </label>
                            {/* Selected tags display */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.product.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index, "product")}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {/* Searchable tag input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={productTagSearch}
                                    onChange={(e) => {
                                        setProductTagSearch(e.target.value);
                                        setShowProductTagDropdown(true);
                                    }}
                                    onFocus={() => setShowProductTagDropdown(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && productTagSearch.trim()) {
                                            e.preventDefault();
                                            const exactMatch = filteredProductTags.find(
                                                (t) => t.name.toLowerCase() === productTagSearch.toLowerCase()
                                            );
                                            if (exactMatch) {
                                                updateProduct({
                                                    tags: [...form.product.tags, exactMatch.name],
                                                });
                                            } else {
                                                updateProduct({
                                                    tags: [...form.product.tags, productTagSearch.trim()],
                                                });
                                            }
                                            setProductTagSearch("");
                                            setShowProductTagDropdown(false);
                                        }
                                    }}
                                    placeholder="Search or type to add tags..."
                                    className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70"
                                />
                                {/* Dropdown */}
                                {showProductTagDropdown && (productTagSearch || filteredProductTags.length > 0) && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 shadow-lg max-h-48 overflow-y-auto">
                                        {filteredProductTags.slice(0, 8).map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => {
                                                    updateProduct({
                                                        tags: [...form.product.tags, tag.name],
                                                    });
                                                    setProductTagSearch("");
                                                    setShowProductTagDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm flex items-center justify-between"
                                            >
                                                <span>{tag.name}</span>
                                                <span className="text-xs text-slate-400">{tag.category}</span>
                                            </button>
                                        ))}
                                        {/* Add custom tag option */}
                                        {productTagSearch.trim() &&
                                            !tagsData.tags.some(
                                                (t) => t.name.toLowerCase() === productTagSearch.toLowerCase()
                                            ) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        updateProduct({
                                                            tags: [...form.product.tags, productTagSearch.trim()],
                                                        });
                                                        setProductTagSearch("");
                                                        setShowProductTagDropdown(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm border-t border-slate-200 text-green-700 font-medium"
                                                >
                                                    + Add custom tag: "{productTagSearch.trim()}"
                                                </button>
                                            )}
                                        {filteredProductTags.length === 0 && !productTagSearch.trim() && (
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
                            {/* Selected tags display */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.store_specific_tags.map((tag, index) => (
                                    <span
                                        key={index}
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
                            {/* Searchable tag input */}
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
                                            // Check if exact match exists in suggestions
                                            const exactMatch = filteredStoreTags.find(
                                                (t) => t.name.toLowerCase() === storeTagSearch.toLowerCase()
                                            );
                                            if (exactMatch) {
                                                updateForm({
                                                    store_specific_tags: [...form.store_specific_tags, exactMatch.name],
                                                });
                                            } else {
                                                // Add as custom tag
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
                                {/* Dropdown */}
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
                                        {/* Add custom tag option */}
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
                    <Button type="submit">Add Product</Button>
                </div>
            </form>
        </div>
    );
}
