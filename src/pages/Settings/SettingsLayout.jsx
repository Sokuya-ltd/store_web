import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SettingsForm from "./SettingsForm";

export default function SettingsLayout() {
    const [activeTab, setActiveTab] = useState(0);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        store_name: "",
        store_description: "",
        store_address: "",
        store_city: "",
        store_state: "",
        store_postal_code: "",
        store_latitude: "",
        store_longitude: "",
        operating_hours: "",
        delivery_radius: 10.0,
        minimum_order_amount: 0.0,
        delivery_fee: 0.0,
        commission_rate: 5.0,
        is_active: true,
        is_verified: false,
        accepts_orders: true,
        rating: 0.0,
        total_reviews: 0,
        total_orders: 0,
        total_revenue: 0.0,
        store_banner: "",
        store_logo: "",
        profile_image: "",
        verification_documents: ""
        // ...add more fields as needed
    });

    const updateForm = (partial) =>
        setForm((prev) => ({
            ...prev,
            ...partial,
        }));

    const submitOnboarding = async () => {
        // TODO: send 'data' to backend via API
        // await api.post("/store/onboarding", data);
        console.log("Submitting onboarding data:", data);
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    };

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
            <div className="bg-white shadow p-6 w-full mx-auto">
                <div className="border-b border-[#556B2F] mb-4">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 0 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(0)}
                        >
                        Personal Information
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 1 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(1)}
                        >
                            Account Security
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 2 ? "border-[#556B2F] text-[#556B2F]" : "border-transparent text-gray-500"
                                }`}
                            onClick={() => setActiveTab(2)}
                        >
                            Finance Information
                        </button>
                    </nav>
                </div>
                <div>
                    {activeTab === 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
                            <SettingsForm form={form} updateForm={updateForm} />
                        </div>
                    )}
                    {activeTab === 1 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Account Security</h2>
                            <p className="text-gray-600">Change your password and manage security settings.</p>
                        </div>
                    )}
                    {activeTab === 2 && (
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
