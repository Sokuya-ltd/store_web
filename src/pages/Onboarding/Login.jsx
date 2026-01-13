import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const updateFormData = (partial) => {
        const fieldName = Object.keys(partial)[0];
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
        setFormData((prev) => ({ ...prev, ...partial }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({});

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            showError("Please fill in all fields", 8000);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post("/store/login", formData);

            showSuccess(response.message || "Login successful!");

            // Use auth context to save login data
            login(response);

            // Navigate to dashboard
            navigate("/", { replace: true });
        } catch (err) {
            // Show error toast with longer duration (8 seconds)
            showError(err.message || "Login failed", 8000);

            // Check if account is not verified (check message content first)
            const errorMessage = err.message?.toLowerCase() || "";
            const dataMessage = err.data?.message?.toLowerCase() || "";

            if (errorMessage.includes("not verified") || dataMessage.includes("not verified")) {
                setShowVerificationMessage(true);
                setError(null);
            } else if (err.status === 422 && err.errors) {
                const errors = {};
                Object.entries(err.errors).forEach(([field, messages]) => {
                    errors[field] = messages[0];
                });
                setFieldErrors(errors);
                setError("Please fix the errors below.");
            } else if (err.status === 401) {
                setError("Invalid email or password. Please try again.");
            } else if (err.status === 403) {
                // Generic forbidden - might be unverified
                setShowVerificationMessage(true);
                setError(null);
            } else {
                setError(err.message || "Login failed. Please try again.");
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
                        Welcome Back!
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl opacity-90">
                        Sign in to manage your store
                    </p>
                </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto justify-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Sign In</h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                    Enter your credentials to access your dashboard
                </p>

                {/* Verification Required Message */}
                {showVerificationMessage ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-800 mb-1">Email Verification Required</h3>
                                    <p className="text-sm text-amber-700 mb-3">
                                        Your account is not yet verified. Please check your email inbox and click the verification link to activate your account.
                                    </p>
                                    <p className="text-xs text-amber-600">
                                        Didn't receive the email? Check your spam folder or request a new verification link.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                onClick={() => {
                                    // TODO: Implement resend verification email
                                    alert("Verification email resent! Please check your inbox.");
                                }}
                                className="w-full bg-[#D35400] hover:bg-[#B84700] text-white py-2"
                            >
                                Resend Verification Email
                            </Button>
                            <button
                                type="button"
                                onClick={() => setShowVerificationMessage(false)}
                                className="text-sm text-slate-600 hover:text-slate-800 underline"
                            >
                                Try with a different account
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            error={fieldErrors.email}
                            placeholder="you@example.com"
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => updateFormData({ password: e.target.value })}
                                error={fieldErrors.password}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-slate-500 hover:text-slate-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#D35400] hover:text-[#B84700] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#D35400] hover:bg-[#B84700] text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        {/* Register Link */}
                        <p className="text-center text-sm text-slate-600 mt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/onboarding"
                                className="text-[#D35400] hover:text-[#B84700] font-medium hover:underline"
                            >
                                Register your store
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
