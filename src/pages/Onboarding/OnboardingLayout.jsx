import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import StepBusinessInfo from "./StepBusinessInfo";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import logo from "../../assets/logo.png";

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

    const updateData = useCallback((partial) =>
        setData((prev) => ({
            ...prev,
            ...partial,
        })), []);

    // Clear field error when user leaves the field (not on every keystroke to avoid focus loss on mobile)
    const clearFieldError = useCallback((fieldName) => {
        setFieldErrors((prev) => {
            if (prev[fieldName]) {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            }
            return prev;
        });
    }, []);

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
        <div className="min-h-screen bg-linear-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>

            <ToastContainer toasts={toasts} onClose={hideToast} />

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center order-1 lg:order-1">
                        <div className="text-white space-y-6">
                            <img src={logo} alt="Sokuya" className="h-40 w-auto mb-2" />
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                    Welcome!
                                </h1>
                                <div className="w-16 h-1 bg-orange-400 rounded-full"></div>
                            </div>
                            
                            <p className="text-lg text-neutral-300 leading-relaxed">
                                Join thousands of store owners managing their business efficiently. Set up your store in minutes and start selling today.
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="order-2 lg:order-2">
                        <div className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Get Started
                            </h2>
                            <p className="text-sm text-neutral-400 mb-8">
                                Create your account and set up your store
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                    <p className="text-red-200 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <Routes>
                                <Route
                                    index
                                    element={
                                        <StepBusinessInfo
                                            data={data}
                                            updateData={updateData}
                                            clearFieldError={clearFieldError}
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
                </div>
            </div>
        </div>
    );
}
