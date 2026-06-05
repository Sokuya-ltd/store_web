import { useState, useEffect } from "react";
import SettingsForm from "./SettingsForm";
import BrandingForm from "./BrandingForm";
import FinanceInformationForm from "./FinanceInformationForm";
import AccountSecurityForm from "./AccountSecurityForm";
import { useStoreProfile } from "../../hooks/useStoreProfile";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ui/ToastContainer";
import api from "../../services/api";
import { AlertTriangle, X, ChevronRight, ChevronDown, Building2, CreditCard, ImageIcon, FileCheck, Lock, Circle, ArrowRight } from "lucide-react";

const SECTION_CONFIG = {
    business_info:          { label: "Business Info",         icon: Building2,  tab: 0 },
    bank_details:           { label: "Bank Details",          icon: CreditCard, tab: 3 },
    store_media:            { label: "Store Media",           icon: ImageIcon,  tab: 1 },
    verification_documents: { label: "Verification Documents", icon: FileCheck,  tab: 0 },
};

export default function SettingsLayout() {
    const { profile, profileCompletion, loading, error, refetch } = useStoreProfile();
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
    const [activeTab, setActiveTab] = useState(0);
    const [completionAlertDismissed, setCompletionAlertDismissed] = useState(false);
    const [completionExpanded, setCompletionExpanded] = useState(false);
    
    // Settings Form State
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Branding Form State (separate)
    const [brandingSubmitting, setBrandingSubmitting] = useState(false);
    const [brandingSubmitError, setBrandingSubmitError] = useState(null);
    const [brandingSubmitSuccess, setBrandingSubmitSuccess] = useState(false);

    // Store status toggle
    const [statusUpdating, setStatusUpdating] = useState(false);

    const handleStatusToggle = async () => {
        if (statusUpdating) return;
        const newStatus = !form.is_active;
        setStatusUpdating(true);
        // Optimistic update
        updateForm({ is_active: newStatus });
        try {
            await api.put("/store/profile", { is_active: newStatus });
            showSuccess(newStatus ? "Store is now Open" : "Store is now Closed");
            await refetch();
        } catch (err) {
            // Revert on failure
            updateForm({ is_active: !newStatus });
            showError(err.message || "Failed to update store status");
        } finally {
            setStatusUpdating(false);
        }
    };
    
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
        tax_id: "",
        bank_name: "",
        bank_account_number: "",
        bank_routing_number: "",
        bank_account_holder: ""
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
            const transformedHours = transformOperatingHours(profile.operating_hours);
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
                tax_id: profile.tax_id || "",
                bank_name: profile.bank_name || "",
                bank_account_number: profile.bank_account_number || "",
                bank_routing_number: profile.bank_routing_number || "",
                bank_account_holder: profile.bank_account_holder || profile.name || ""
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
                store_description: form.store_description ? String(form.store_description) : "",
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

            const response = await api.put("/store/profile", payload);
            setSubmitSuccess(true);
            
            // Show success toast with message from API
            showSuccess(response.message || "Profile updated successfully!");
            
            // Optionally refetch profile to sync with server
            await refetch();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            const errorMessage = err.errors || err.message || "Failed to update profile";
            setSubmitError(errorMessage);
            showError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Branding Form Submission
    const handleBrandingSubmit = async (e) => {
        e.preventDefault();
        setBrandingSubmitting(true);
        setBrandingSubmitError(null);
        setBrandingSubmitSuccess(false);

        try {
            // Files are uploaded individually through BrandingForm component
            // This submit just confirms the branding update
            
            // If you need to sync metadata or notify backend of updates,
            // you can call an endpoint here, otherwise just show success
            // For now, we'll consider it successful since files are uploaded via /store/upload
            
            setBrandingSubmitSuccess(true);
            showSuccess("Branding updated successfully!");
            
            // Refetch profile to sync with server
            await refetch();
            
            // Clear success message after 3 seconds
            setTimeout(() => setBrandingSubmitSuccess(false), 3000);
        } catch (err) {
            const errorMessage = err.errors || err.message || "Failed to update branding";
            setBrandingSubmitError(errorMessage);
            showError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setBrandingSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-orange-400 mx-auto"></div>
                    <p className="mt-4 text-neutral-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 w-full">
                <div className="bg-red-400/10 border border-red-400/30 text-red-300 px-4 py-3 rounded">
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

    const allSections = profileCompletion
        ? Object.entries(profileCompletion).filter(([key]) => key !== "overall_complete")
        : [];
    const totalSections = allSections.length;
    const completeSections = allSections.filter(([, val]) => val?.complete === true).length;
    const incompleteSectionsList = allSections
        .filter(([, val]) => val?.complete === false)
        .map(([key, val]) => ({ key, missing: val.missing }));
    const allMissingFields = incompleteSectionsList.flatMap(s => s.missing);
    const previewFields = allMissingFields.slice(0, 2);
    const extraCount = allMissingFields.length - previewFields.length;
    const pct = totalSections > 0 ? Math.round((completeSections / totalSections) * 100) : 0;

    return (
        <div className="w-full space-y-8 px-6 py-6">
            {/* Profile Completion — compact collapsible banner */}
            {!completionAlertDismissed && profileCompletion && !profileCompletion.overall_complete && incompleteSectionsList.length > 0 && (
                <div className="border border-orange-500/30 bg-[#1a1208] rounded-xl overflow-hidden">

                    {/* ── Compact bar (always visible) ── */}
                    <div className="flex items-center gap-3 px-4 py-3">
                        {/* Icon + label */}
                        <AlertTriangle size={15} className="shrink-0 text-orange-400" />
                        <span className="text-orange-300 text-sm font-semibold whitespace-nowrap">Profile incomplete</span>
                        <span className="text-orange-500/50 text-sm">—</span>

                        {/* Field preview pills */}
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
                            {previewFields.map(f => (
                                <span key={f} className="shrink-0 bg-orange-500/15 text-orange-300 text-xs px-2 py-0.5 rounded-full border border-orange-500/20">
                                    {f}
                                </span>
                            ))}
                            {extraCount > 0 && (
                                <span className="shrink-0 text-orange-400/60 text-xs font-medium">+{extraCount} more</span>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <div className="w-20 h-1 bg-orange-900/60 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-orange-300/50 text-xs whitespace-nowrap">{completeSections}/{totalSections}</span>
                        </div>

                        {/* Expand toggle */}
                        <button
                            onClick={() => setCompletionExpanded(v => !v)}
                            className="shrink-0 flex items-center gap-1 text-orange-400 text-xs font-semibold hover:text-orange-300 transition-colors px-2 py-1 rounded-md hover:bg-orange-500/10"
                        >
                            {completionExpanded ? "Hide" : "Details"}
                            <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${completionExpanded ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Dismiss */}
                        <button
                            onClick={() => setCompletionAlertDismissed(true)}
                            className="shrink-0 p-1 text-orange-400/40 hover:text-orange-300 transition-colors rounded"
                            aria-label="Dismiss"
                        >
                            <X size={13} />
                        </button>
                    </div>

                    {/* ── Expandable detail panel ── */}
                    {completionExpanded && (
                        <>
                            <div className="border-t border-orange-500/20 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {incompleteSectionsList.map(({ key, missing }) => {
                                    const config = SECTION_CONFIG[key] || { label: key.replace(/_/g, " "), icon: AlertTriangle, tab: 0 };
                                    const SectionIcon = config.icon;
                                    return (
                                        <div key={key} className="border border-orange-500/20 bg-orange-500/5 rounded-lg overflow-hidden">
                                            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-orange-500/15">
                                                <div className="p-1.5 bg-orange-500/15 rounded-md">
                                                    <SectionIcon size={13} className="text-orange-400" />
                                                </div>
                                                <span className="text-orange-300 text-xs font-semibold uppercase tracking-wider">{config.label}</span>
                                            </div>
                                            <div className="divide-y divide-orange-500/10">
                                                {missing.map((field) => (
                                                    <button
                                                        key={field}
                                                        onClick={() => { setActiveTab(config.tab); setCompletionExpanded(false); }}
                                                        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-orange-500/10 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <Circle size={7} className="text-orange-500/50 shrink-0" />
                                                            <span className="text-orange-200/80 text-sm">{field}</span>
                                                        </div>
                                                        <ChevronRight size={13} className="text-orange-500/40 group-hover:text-orange-400 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-t border-orange-500/20 bg-orange-500/5">
                                <div className="flex items-center gap-1.5 text-orange-300/40 text-xs">
                                    <Lock size={11} />
                                    <span>Your information is encrypted and secure</span>
                                </div>
                                {incompleteSectionsList.some(s => s.key === "bank_details") && (
                                    <button
                                        onClick={() => { setActiveTab(3); setCompletionExpanded(false); }}
                                        className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Go to Finance Information
                                        <ArrowRight size={12} />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Header with Title and Status Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Store Profile</h1>
                    <p className="text-neutral-400 text-sm mt-1">Manage your store's public information and settings.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm font-medium text-neutral-300">Store Status:</span>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/20 px-3 py-2">
                        {statusUpdating ? (
                            <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                        ) : (
                            <div className={`h-2 w-2 rounded-full ${form.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        )}
                        <span className={`text-sm font-medium ${statusUpdating ? 'text-neutral-400' : form.is_active ? 'text-green-400' : 'text-red-400'}`}>
                            {statusUpdating ? 'Updating…' : form.is_active ? 'Open' : 'Closed'}
                        </span>
                        <button
                            type="button"
                            onClick={handleStatusToggle}
                            disabled={statusUpdating}
                            aria-label={form.is_active ? 'Close store' : 'Open store'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                form.is_active ? 'bg-green-500' : 'bg-white/20'
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
            <div className="bg-white/7 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 w-full">
                <div className="border-b border-white/10 mb-4 overflow-x-auto">
                    <nav className="flex space-x-2 md:space-x-4 min-w-max md:min-w-0" aria-label="Tabs">
                        <button
                            className={`py-2 px-2 md:px-4 font-medium text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 0 ? 'border-orange-400 text-orange-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                            onClick={() => setActiveTab(0)}
                        >
                            Store Profile
                        </button>
                        <button
                            className={`py-2 px-2 md:px-4 font-medium text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 1 ? 'border-orange-400 text-orange-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                            onClick={() => setActiveTab(1)}
                        >
                            Branding
                        </button>
                        <button
                            className={`py-2 px-2 md:px-4 font-medium text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 2 ? 'border-orange-400 text-orange-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                            onClick={() => setActiveTab(2)}
                        >
                            Account Security
                        </button>
                        <button
                            className={`py-2 px-2 md:px-4 font-medium text-xs md:text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 3 ? 'border-orange-400 text-orange-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
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
                        <AccountSecurityForm />
                    )}
                    {activeTab === 3 && (
                        <FinanceInformationForm initialData={form} onRefetch={refetch} />
                    )}
                </div>
            </div>
        </div>
    );
}
