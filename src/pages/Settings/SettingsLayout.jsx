import { useState, useEffect } from "react";
import SettingsForm from "./SettingsForm";
import BrandingForm from "./BrandingForm";
import { useStoreProfile } from "../../hooks/useStoreProfile";
import api from "../../services/api";

export default function SettingsLayout() {
    const { profile, loading, error, refetch } = useStoreProfile();
    const [activeTab, setActiveTab] = useState(0);
    
    // Settings Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Branding Form State (separate)
    const [brandingSubmitting, setBrandingSubmitting] = useState(false);
    const [brandingSubmitError, setBrandingSubmitError] = useState(null);
    const [brandingSubmitSuccess, setBrandingSubmitSuccess] = useState(false);
    
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        store_name: "",
        store_description: "",
        store_address: "",
        store_city: "",
        store_state: "",
        store_postal_code: "",
        store_latitude: "",
        store_longitude: "",
        operating_hours: {},
        delivery_radius: "",
        minimum_order_amount: "",
        delivery_fee: "",
        commission_rate: "",
        is_active: true,
        is_verified: false,
        accepts_orders: true,
        verification_documents: "",
        business_registration_number: "",
        bank_name: ""
    });

    // Separate branding form state
    const [brandingForm, setBrandingForm] = useState({
        store_banner: "",
        store_logo: "",
        profile_image: ""
    });

    // Transform API operating_hours format to component format
    const transformOperatingHours = (apiHours) => {
        if (!apiHours || typeof apiHours !== 'object') return {};
        
        const dayMap = {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
        };
        
        const transformed = {};
        Object.entries(apiHours).forEach(([key, value]) => {
            const capitalizedDay = dayMap[key.toLowerCase()];
            if (capitalizedDay && value) {
                transformed[capitalizedDay] = {
                    enabled: true,
                    from: value.open || '09:00',
                    to: value.close || '17:30'
                };
            }
        });
        return transformed;
    };

    // Populate form when profile is loaded
    useEffect(() => {
        if (profile) {
            console.log("Profile loaded:", profile);
            console.log("store_longitude:", profile.store_longitude);
            console.log("store_latitude:", profile.store_latitude);
            console.log("API operating_hours:", profile.operating_hours);
            const transformedHours = transformOperatingHours(profile.operating_hours);
            console.log("Transformed operating_hours:", transformedHours);
            setForm({
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                store_name: profile.store_name || "",
                store_description: profile.store_description || "",
                store_address: profile.store_address || "",
                store_city: profile.store_city || "",
                store_state: profile.store_state || "",
                store_postal_code: profile.store_postal_code || "",
                store_latitude: profile.store_latitude || "",
                store_longitude: profile.store_longitude || "",
                operating_hours: transformedHours,
                delivery_radius: profile.delivery_radius != null ? parseFloat(profile.delivery_radius) : "",
                minimum_order_amount: profile.minimum_order_amount != null ? parseFloat(profile.minimum_order_amount) : "",
                delivery_fee: profile.delivery_fee != null ? parseFloat(profile.delivery_fee) : "",
                commission_rate: profile.commission_rate != null ? parseFloat(profile.commission_rate) : "",
                is_active: profile.is_active ?? true,
                is_verified: profile.is_verified ?? false,
                accepts_orders: profile.accepts_orders ?? true,
                rating: profile.rating != null ? parseFloat(profile.rating) : 0,
                total_reviews: profile.total_reviews ?? 0,
                total_orders: profile.total_orders ?? 0,
                total_revenue: profile.total_revenue != null ? parseFloat(profile.total_revenue) : 0,
                verification_documents: profile.verification_documents || "",
                business_registration_number: profile.business_registration_number || "",
                bank_name: profile.bank_name || ""
            });

            // Populate branding form separately
            setBrandingForm({
                store_banner: profile.store_banner || "",
                store_logo: profile.store_logo || "",
                profile_image: profile.profile_image || ""
            });
        }
    }, [profile]);

    const updateForm = (partial) =>
        setForm((prev) => ({
            ...prev,
            ...partial,
        }));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Transform operating_hours back to API format for submission
    const transformOperatingHoursForApi = (componentHours) => {
        if (!componentHours || typeof componentHours !== 'object') return {};
        
        const apiHours = {};
        Object.entries(componentHours).forEach(([day, value]) => {
            if (value?.enabled) {
                apiHours[day.toLowerCase()] = {
                    open: value.from || '09:00',
                    close: value.to || '17:30'
                };
            }
        });
        return apiHours;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Prepare payload - transform data back to API format
            const payload = {
                name: form.name,
                phone: form.phone,
                store_name: form.store_name,
                store_description: form.store_description,
                store_address: form.store_address,
                store_city: form.store_city,
                store_state: form.store_state,
                store_postal_code: form.store_postal_code,
                store_latitude: form.store_latitude ? String(form.store_latitude) : null,
                store_longitude: form.store_longitude ? String(form.store_longitude) : null,
                operating_hours: transformOperatingHoursForApi(form.operating_hours),
                delivery_radius: form.delivery_radius ? String(form.delivery_radius) : null,
                minimum_order_amount: form.minimum_order_amount ? String(form.minimum_order_amount) : null,
                delivery_fee: form.delivery_fee ? String(form.delivery_fee) : null,
                commission_rate: form.commission_rate ? String(form.commission_rate) : null,
                accepts_orders: form.accepts_orders,
            };

            console.log("Submitting payload:", JSON.stringify(payload, null, 2));

            await api.put("/store/profile", payload);
            setSubmitSuccess(true);
            
            // Optionally refetch profile to sync with server
            await refetch();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setSubmitError(err.errors || err.message || "Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Branding Form Submission (separate endpoint)
    const handleBrandingSubmit = async (e) => {
        e.preventDefault();
        setBrandingSubmitting(true);
        setBrandingSubmitError(null);
        setBrandingSubmitSuccess(false);

        try {
            // Create FormData for file uploads
            const formData = new FormData();
            
            if (brandingForm.store_logo instanceof File) {
                formData.append('store_logo', brandingForm.store_logo);
            }
            if (brandingForm.store_banner instanceof File) {
                formData.append('store_banner', brandingForm.store_banner);
            }
            if (brandingForm.profile_image instanceof File) {
                formData.append('profile_image', brandingForm.profile_image);
            }

            console.log("Submitting branding files");

            // Send to separate branding endpoint
            await api.post("/store/branding", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setBrandingSubmitSuccess(true);
            
            // Refetch profile to sync with server
            await refetch();
            
            // Clear success message after 3 seconds
            setTimeout(() => setBrandingSubmitSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update branding:", err);
            setBrandingSubmitError(err.errors || err.message || "Failed to update branding");
        } finally {
            setBrandingSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 w-full">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">Error loading profile</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={refetch}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full">
            {/* Header with Title and Status Toggle */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Store Profile</h1>
                    <p className="text-slate-600 text-sm mt-1">Manage your store's public information and settings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">Store Status:</span>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
                        <div className={`h-2 w-2 rounded-full ${form.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-medium ${form.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {form.is_active ? 'Open' : 'Closed'}
                        </span>
                        <button
                            type="button"
                            onClick={() => updateForm({ ...form, is_active: !form.is_active })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.is_active ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    form.is_active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white shadow rounded-lg p-6 w-full">
                <div className="border-b border-slate-200 mb-4">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 0 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(0)}
                        >
                            Store Profile
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 1 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Branding
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 2 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(2)}
                        >
                            Account Security
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 3 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(3)}
                        >
                            Finance Information
                        </button>
                    </nav>
                </div>
                <div>
                    {activeTab === 0 && (
                        <SettingsForm 
                            form={form} 
                            updateForm={updateForm}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            submitError={submitError}
                            submitSuccess={submitSuccess}
                        />
                    )}
                    {activeTab === 1 && (
                        <BrandingForm 
                            form={brandingForm} 
                            updateForm={setBrandingForm}
                            onSubmit={handleBrandingSubmit}
                            submitting={brandingSubmitting}
                            submitError={brandingSubmitError}
                            submitSuccess={brandingSubmitSuccess}
                        />
                    )}
                    {activeTab === 2 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Account Security</h2>
                            <p className="text-gray-600">Change your password and manage security settings.</p>
                        </div>
                    )}
                    {activeTab === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Finance Information</h2>
                            <p className="text-gray-600">Manage your payment methods and billing info.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
