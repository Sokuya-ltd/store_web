import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import ImageUpload from "../../components/ui/ImageUpload";
import MultiImageUpload from "../../components/ui/MultiImageUpload";
import { useToast } from "../../context/ToastContext";
import { colors } from "../../lib/colors";
import api from "../../services/api";

export default function ProductAdd() {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categorySearch, setCategorySearch] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [storeTagSearch, setStoreTagSearch] = useState("");
    const [showStoreTagDropdown, setShowStoreTagDropdown] = useState(false);
    const [productTagSearch, setProductTagSearch] = useState("");
    const [showProductTagDropdown, setShowProductTagDropdown] = useState(false);
    const [productImageFile, setProductImageFile] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const dropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const storeTagDropdownRef = useRef(null);
    const productTagDropdownRef = useRef(null);

    // API data state
    const [apiProducts, setApiProducts] = useState([]);
    const [apiCategories, setApiCategories] = useState([]);
    const [apiTags, setApiTags] = useState([]);

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
    const [loadError, setLoadError] = useState(null);

    // Fetch data from API on component mount (only once)
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const response = await api.get("/store/products/create");

                if (!isMounted) return;

                if (response?.data) {
                    setApiProducts(response.data.products || []);
                    setApiCategories(response.data.categories || []);
                    setApiTags(response.data.tags || []);
                }
            } catch (error) {
                if (!isMounted) return;

                const errorMsg = error?.response?.data?.message || error?.message || "Failed to load products, categories, and tags";
                setLoadError(errorMsg);
                toast.error(errorMsg);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function to prevent setting state on unmounted component
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - run only on mount

    // Flatten categories for searchable dropdown
    const flattenedCategories = useMemo(() => {
        const result = [];
        apiCategories.forEach((parent) => {
            // Add parent category
            result.push({
                id: parent.id,
                name: parent.name,
                displayName: parent.name,
                isParent: true,
            });
            // Add subcategories with parent name prefix
            if (parent.children && Array.isArray(parent.children)) {
                parent.children.forEach((sub) => {
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
    }, [apiCategories]);

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
        if (!form.category) {
            return "";
        }
        // Build display name from embedded category
        const displayName = form.category.parent_name
            ? `${form.category.parent_name} > ${form.category.name}`
            : form.category.name;
        return displayName;
    }, [form.category, suggestedCategory]);

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        return apiProducts.filter((product) =>
            product.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, apiProducts]);

    // Filter store tags based on search and exclude already selected
    const filteredStoreTags = useMemo(() => {
        const selectedTags = form.store_specific_tags || [];
        return apiTags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(storeTagSearch.toLowerCase()) &&
                !selectedTags.includes(tag.name)
        );
    }, [storeTagSearch, form.store_specific_tags, apiTags]);

    // Filter product tags based on search and exclude already selected
    const filteredProductTags = useMemo(() => {
        const selectedTags = form.product.tags || [];
        return apiTags.filter(
            (tag) =>
                tag.name.toLowerCase().includes(productTagSearch.toLowerCase()) &&
                !selectedTags.includes(tag.name)
        );
    }, [productTagSearch, form.product.tags, apiTags]);

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
            slug: category.id,
            parent_id: category.isParent ? null : category.id.split('-').slice(0, 2).join('-'),
            parent_name: category.parentName || null,
        };

        // Update form state with new category
        setForm(prevForm => {
            const newForm = {
                ...prevForm,
                category: embeddedCategory,
                product: {
                    ...prevForm.product,
                    category_id: category.id
                }
            };
            return newForm;
        });

        // Clear search and close dropdown
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

    const handleSelectProduct = (storeProduct) => {
        // Extract the product data from the store product response
        const product = storeProduct.product;

        setSearchQuery(product.name);

        setForm({
            ...form,
            // Auto-fill store-specific fields from existing product
            price: storeProduct.price || "",
            compare_at_price: storeProduct.compare_at_price || "",
            stock_qty: storeProduct.stock_qty || "",
            stock_reserved: storeProduct.stock_reserved || 0,
            reorder_threshold: storeProduct.reorder_threshold || 5,
            sku: storeProduct.sku || "",
            barcode: storeProduct.barcode || "",
            status: storeProduct.status || "active",
            variant_options: storeProduct.variant_options || {
                size: "",
                color: "",
            },
            weight: storeProduct.weight || "",
            store_specific_tags: storeProduct.store_specific_tags || [],
            store_notes: storeProduct.store_notes || "",
            category: null,  // Let user select their own category
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Comprehensive validation
        if (!form.product.name?.trim()) {
            toast.error("Product name is required");
            return;
        }
        if (!form.category?.id) {
            toast.error("Please select a category");
            return;
        }
        if (!form.price || parseFloat(form.price) <= 0) {
            toast.error("Please enter a valid price");
            return;
        }
        if (!form.stock_qty || parseInt(form.stock_qty) < 0) {
            toast.error("Please enter a valid stock quantity");
            return;
        }
        if (productImages.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }
        if (form.compare_at_price && form.price) {
            const comparePrice = parseFloat(form.compare_at_price);
            const regularPrice = parseFloat(form.price);
            if (comparePrice <= regularPrice) {
                toast.error("Compare at price must be greater than regular price");
                return;
            }
        }
        if (form.store_notes && form.store_notes.length > 500) {
            toast.error("Store notes must not exceed 500 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            // Generate IDs for new entries
            const productId = isNewProduct ? crypto.randomUUID() : form.product.id;

            // Build FormData to handle both image files and product data
            const formData = new FormData();
            
            // Add product fields (convert to strings for FormData)
            formData.append("product_name", form.product.name.trim());
            if (form.product.brand?.trim()) {
                formData.append("brand", form.product.brand.trim());
            }
            if (form.product.description?.trim()) {
                formData.append("description", form.product.description.trim());
            }
            formData.append("category_id", String(form.category.id));
            formData.append("unit", form.product.unit || "kg");
            formData.append("price", String(parseFloat(form.price)));
            if (form.compare_at_price) {
                formData.append("compare_at_price", String(parseFloat(form.compare_at_price)));
            }
            formData.append("initial_stock", String(parseInt(form.stock_qty)));
            formData.append("reorder_threshold", String(parseInt(form.reorder_threshold) || 5));
            if (form.sku?.trim()) {
                formData.append("sku", form.sku.trim());
            }
            if (form.barcode?.trim()) {
                formData.append("barcode", form.barcode.trim());
            }
            if (form.weight) {
                formData.append("weight", String(parseFloat(form.weight)));
            }
            if (form.store_notes?.trim()) {
                formData.append("store_notes", form.store_notes.trim());
            }
            
            // Add tags
            const sanitizedTags = form.product.tags
                .map(tag => String(tag).trim())
                .filter(tag => tag.length > 0 && tag.length <= 50);
            if (sanitizedTags.length > 0) {
                sanitizedTags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }
            
            // Add images
            productImages.forEach((image, index) => {
                if (image.file) {
                    const fileSizeMB = (image.file.size / 1024 / 1024).toFixed(2);
                    console.log(`📤 Uploading image ${index + 1}: ${image.file.name} (${fileSizeMB}MB)`);
                    formData.append(`images[${index}]`, image.file);
                    if (image.alt_text) {
                        formData.append(`images_alt_text[${index}]`, image.alt_text);
                    }
                    if (image.is_primary) {
                        formData.append(`images_primary[${index}]`, "1");
                    }
                }
            });
            
            // Submit to API using uploadFile to properly handle FormData
            const response = await api.uploadFile("/store/products", formData);

            toast.success(`Product "${form.product.name}" added successfully!`);
            navigate("/products");
        } catch (error) {
            // Handle 409 Conflict: Product already exists in store
            if (error?.response?.status === 409) {
                toast.info("This product already exists in your store");
                return;
            }

            // Handle 422 Validation errors from API
            if (error?.response?.status === 422) {
                const errors = error?.response?.data?.errors || {};
                const errorMessages = Object.entries(errors)
                    .map(([field, messages]) => `${field}: ${messages[0]}`)
                    .join("\n");
                toast.error(errorMessages);
                return;
            }

            // Handle 400 Bad Request
            if (error?.response?.status === 400) {
                const errorMessage = error?.response?.data?.message || "Invalid request data";
                toast.error(errorMessage);
                return;
            }

            // Generic error handling
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add product. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Add New Product</h2>
                    <p>Add a new product to your store with images and pricing details</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/products")}
                    disabled={isLoading || isSubmitting}
                >
                    Cancel
                </Button>
            </div>

            {isLoading ? (
                <Card className="p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-4"></div>
                            <p className="text-slate-600">Loading products, categories, and tags...</p>
                        </div>
                    </div>
                </Card>
            ) : loadError ? (
                <Card className="p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="text-rose-600 text-4xl mb-4">⚠️</div>
                            <p className="text-slate-900 font-medium mb-2">Failed to Load</p>
                            <p className="text-slate-600 mb-4">{loadError}</p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </Card>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Selection */}
                        <Card className="p-6 rounded-lg">
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
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {filteredProducts.length > 0 ? (
                                            <>
                                                {filteredProducts.slice(0, 10).map((storeProduct) => (
                                                    <div
                                                        key={storeProduct.id}
                                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                                                        onClick={() => handleSelectProduct(storeProduct)}
                                                    >
                                                        <img
                                                            src={storeProduct.product?.image_url}
                                                            alt={storeProduct.product?.name}
                                                            className="w-8 h-8 object-cover bg-slate-100"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{storeProduct.product?.name}</p>
                                                            <p className="text-xs text-slate-500">{storeProduct.product?.brand}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div
                                                    className="px-4 py-3 border-t border-slate-100 cursor-pointer font-medium text-sm"
                                                    style={{ backgroundColor: "transparent", color: colors.primary.main }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary.main}15`}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                                    onClick={handleCreateNew}
                                                >
                                                    + Create new product "{searchQuery}"
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                className="px-4 py-3 cursor-pointer font-medium text-sm"
                                                style={{ backgroundColor: "transparent", color: colors.primary.main }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary.main}15`}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                                onClick={handleCreateNew}
                                            >
                                                + Create new product "{searchQuery}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {form.product.name && !isNewProduct && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center gap-4">
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

                        {/* Product Details (shown for both new and existing products) */}
                        {form.product.name && (
                            <Card className="p-6 rounded-lg">
                                <h3 className="font-medium text-slate-900 mb-4">{isNewProduct ? "New" : ""} Product Details</h3>
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
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg">
                                                <div className="p-2 border-b border-slate-100">
                                                    <input
                                                        type="text"
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        placeholder="Search categories..."
                                                        className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 rounded-lg"
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
                                                                        } ${form.category?.id === category.id ? "bg-orange-50 text-orange-600" : ""}`}
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
                                    {/* Product Tags - Shown for All Products */}
                                    <div ref={productTagDropdownRef}>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Product Tags
                                        </label>
                                        {/* Tag input and dropdown */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search and add product tags..."
                                                value={productTagSearch}
                                                onChange={(e) => setProductTagSearch(e.target.value)}
                                                onClick={() => setShowProductTagDropdown(true)}
                                                className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 rounded-lg"
                                            />
                                            {showProductTagDropdown && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg">
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {filteredProductTags.length > 0 ? (
                                                            filteredProductTags.map((tag) => (
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
                                                            ))
                                                        ) : (
                                                            <div className="px-3 py-2 text-sm text-slate-500">
                                                                No tags available
                                                            </div>
                                                        )}
                                                        {/* Add custom tag option */}
                                                        {productTagSearch.trim() &&
                                                            !apiTags.some(
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
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Selected tags display - Moved to bottom */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {form.product.tags.map((tag, index) => (
                                                <span
                                                    key={`${tag}-${index}`}
                                                    className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-full flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(index, "product")}
                                                        className="text-slate-400 hover:text-slate-600"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Images Upload - Multiple Images Support */}
                                <div className="mt-4">
                                    <MultiImageUpload
                                        label="Product Images"
                                        value={productImages}
                                        onChange={setProductImages}
                                        maxImages={5}
                                        maxFileSize={5}
                                    />
                                </div>

                                {/* Description & Ingredients - Only for New Products */}
                                {isNewProduct && (
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
                                )}
                            </Card>
                        )}

                        {/* Store Product Details */}
                        <Card className="p-6 rounded-lg">
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
                        <Card className="p-6 rounded-lg">
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
                        <Card className="p-6 rounded-lg">
                            <h3 className="font-medium text-slate-900 mb-4">Store-Specific Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                        <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Store Notes
                                    </label>
                                    <span className={`text-xs ${form.store_notes.length > 500 ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                                        {form.store_notes.length}/500
                                    </span>
                                </div>
                                <Textarea
                                    rows={3}
                                    value={form.store_notes}
                                    onChange={(e) => updateForm({ store_notes: e.target.value.substring(0, 500) })}
                                    placeholder="Internal notes about this product (max 500 characters)..."
                                />
                            </div>
                                <div ref={storeTagDropdownRef}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Store-Specific Tags
                                    </label>
                                    {/* Selected tags display */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {form.store_specific_tags.map((tag, index) => (
                                            <span
                                                key={`${tag}-${index}`}
                                                className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full flex items-center gap-1"
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
                                            className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 rounded-lg"
                                        />
                                        {/* Dropdown */}
                                        {showStoreTagDropdown && (storeTagSearch || filteredStoreTags.length > 0) && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 shadow-lg max-h-48 overflow-y-auto rounded-xl">
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
                                disabled={isSubmitting}
                                style={{ borderColor: colors.neutral[300], color: colors.neutral[700] }}
                            >
                                Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={isSubmitting}
                              style={{ backgroundColor: colors.primary.main }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary.dark}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary.main}
                            >
                                {isSubmitting ? "Adding Product..." : "Add Product"}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
