import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import StepBusinessInfo from "./StepBusinessInfo";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";

export default function OnboardingLayout() {
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
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
        minimum_order_amount: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();

    const updateData = (partial) =>
        setData((prev) => ({
            ...prev,
            ...partial,
        }));

    // Clear field error when user starts typing
    const updateDataWithClear = (partial) => {
        const fieldName = Object.keys(partial)[0];
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
        updateData(partial);
    };

    const submitOnboarding = async () => {
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({});

        try {
            const response = await api.post("/store/register", data);

            showSuccess(response.message || "Registration successful!");

            // Store token if returned
            if (response.token) {
                localStorage.setItem("auth_token", response.token);
            }

            // Navigate to success page with response data
            navigate("/onboarding/success", { 
                state: {
                    store_owner: response.store_owner,
                    next_steps: response.next_steps,
                    message: response.message
                },
                replace: true 
            });
        } catch (err) {
            // Handle validation errors
            if (err.status === 422 && err.errors) {
                // Set field-specific errors
                const errors = {};
                Object.entries(err.errors).forEach(([field, messages]) => {
                    errors[field] = messages[0]; // Take first error message for each field
                });
                setFieldErrors(errors);
                const errorMessage = "Please fix the errors below.";
                setError(errorMessage);
                showError(errorMessage);
            } else if (err.status === 500) {
                // Server error - show more details for debugging
                const serverMessage = err.data?.message || err.data?.error || err.message;
                const errorMsg = `Server error: ${serverMessage}`;
                setError(errorMsg);
                showError(errorMsg);
            } else {
                const errorMsg = err.message || "Registration failed. Please try again.";
                setError(errorMsg);
                showError(errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-10 gap-0 overflow-hidden">
            <ToastContainer toasts={toasts} onClose={hideToast} />
            
            {/* Left content */}
            <div className="lg:col-span-6 bg-[#D35400] p-6 sm:p-8 lg:p-16 flex items-center justify-center">
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
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto justify-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Store Setup</h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                    Tell us about your business
                </p>
                <Routes>
                    <Route
                        index
                        element={
                            <StepBusinessInfo 
                                data={data} 
                                updateData={updateDataWithClear}
                                onSubmit={submitOnboarding}
                                isSubmitting={isSubmitting}
                                error={error}
                                fieldErrors={fieldErrors}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}
