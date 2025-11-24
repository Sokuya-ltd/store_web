import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import StepBusinessInfo from "./StepBusinessInfo";

export default function OnboardingLayout() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        store_name: "",
        description: "",
        business_registration_number: "",
        commission_rate: 15.5,
    });

    const navigate = useNavigate();

    const updateData = (partial) =>
        setData((prev) => ({
            ...prev,
            ...partial,
        }));

    const submitOnboarding = async () => {
        // TODO: send 'data' to backend via API
        // await api.post("/store/onboarding", data);
        console.log("Submitting onboarding data:", data);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-10 gap-0 overflow-hidden">
            {/* Left content */}
            <div className="lg:col-span-7 bg-[#D35400] p-6 sm:p-8 lg:p-16 flex items-center justify-center">
                <div className="text-white text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Welcome to Sokuya Store
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl opacity-90">
                        Set up your store in just a few steps
                    </p>
                </div>
            </div>
            {/* Right content */}
            <div className="lg:col-span-3 bg-white p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto justify-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Store Setup</h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                    Tell us about your business
                </p>
                <Routes>
                    <Route
                        index
                        element={<StepBusinessInfo data={data} updateData={updateData} />}
                    />
                </Routes>
            </div>
        </div>
    );
}
