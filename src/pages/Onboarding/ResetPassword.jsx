import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
    
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [localError, setLocalError] = useState(null);

    // Validate token on mount
    useEffect(() => {
        if (!token || !email) {
            setError("Invalid reset link. Please request a new password reset.");
            setIsValidating(false);
            return;
        }
        setIsTokenValid(true);
        setIsValidating(false);
    }, [token, email]);

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

        // Validation
        if (!formData.password || !formData.password_confirmation) {
            setError("Please fill in all fields");
            showError("Please fill in all fields");
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 8) {
            setFieldErrors({ password: "Password must be at least 8 characters" });
            setError("Please fix the errors below");
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setFieldErrors({
                password_confirmation: "Passwords do not match"
            });
            setError("Passwords do not match");
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Submitting password reset request:', { token, email, password: '***' });
            setLocalError(null);
            
            const response = await api.post("/store/reset-password", {
                token,
                email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            console.log('Password reset response:', response);
            
            showSuccess(response.message || "Password reset successful!");
            setSuccessMessage(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch (err) {
            console.error('Password reset error:', err);
            
            // Handle specific error cases from backend
            if (err.status === 422) {
                // Validation errors
                if (err.errors) {
                    setFieldErrors(err.errors);
                    const errorMessages = Object.entries(err.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    setError(`Validation failed:\n${errorMessages}`);
                } else {
                    setError(err.message || "Validation failed");
                }
            } else if (err.status === 401) {
                // Invalid or expired token
                setError("Invalid or expired reset token. Please request a new password reset.");
                showError("Invalid or expired reset token. Redirecting to forgot password...", 8000);
                setTimeout(() => {
                    navigate("/forgot-password", { replace: true });
                }, 3000);
            } else if (err.status === 404) {
                // Account not found
                setError("No account found with this email address.");
                showError("Account not found. Please check your email and try again.", 8000);
            } else {
                const errorMsg = err.message || "Failed to reset password";
                showError(errorMsg, 8000);
                setError(errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <svg className="animate-spin h-8 w-8 text-orange-500 mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-white">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>

                <ToastContainer toasts={toasts} onClose={hideToast} />

                <div className="max-w-md w-full relative z-10">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/20 border border-red-400/50 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.343 4.343a8.968 8.968 0 0111.314 0m-1.414 1.414a6.968 6.968 0 00-9.9 0m11.314 9.9a8.968 8.968 0 01-11.314 0m1.414-1.414a6.968 6.968 0 009.9 0" />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Link Expired
                            </h2>
                            <p className="text-purple-200">
                                The password reset link has expired or is invalid. Please request a new one.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/forgot-password")}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Request New Link
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-2 px-4 text-orange-400 hover:text-orange-300 font-semibold transition-colors flex items-center justify-center gap-2 group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex flex-col lg:items-center lg:justify-center p-3 md:p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

            <ToastContainer toasts={toasts} onClose={hideToast} />

            <div className="w-full max-w-5xl relative z-10 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 w-full">
                    {/* Left Content - Hidden on mobile */}
                    <div className="hidden md:flex flex-col justify-center order-2 lg:order-1">
                        <div className="text-white space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
                                    Reset Password
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                            </div>

                            <p className="text-base md:text-lg text-purple-200 leading-relaxed">
                                Create a strong new password to secure your account. Make sure to use a combination of letters, numbers, and special characters.
                            </p>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-orange-400">Password Tips</h3>
                                <ul className="space-y-2 text-purple-200 text-sm">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <span>At least 8 characters long</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <span>Mix of upper and lower case letters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <span>Include numbers and special characters</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="order-1 md:order-2">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                            {successMessage ? (
                                // Success State
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Password Reset!
                                        </h2>
                                        <p className="text-purple-200">
                                            Your password has been successfully reset. You can now sign in with your new password.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate("/login")}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            ) : (
                                // Form State
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                        Reset Password
                                    </h2>
                                    <p className="text-xs md:text-sm text-purple-200 mb-8">
                                        Enter a new password to secure your account
                                    </p>

                                    {(error || localError) && (
                                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                            <p className="text-red-200 text-sm font-medium">{error || localError}</p>
                                        </div>
                                    )}

                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        {/* New Password */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
                                                New Password
                                                <span className="text-orange-400 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => updateFormData({ password: e.target.value })}
                                                    placeholder="••••••••"
                                                    required
                                                    aria-invalid={!!fieldErrors.password}
                                                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                                                    className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3.5 text-purple-300/50 hover:text-purple-200 transition-colors"
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {fieldErrors.password && (
                                                <p id="password-error" className="text-red-300 text-xs mt-1.5">
                                                    {fieldErrors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-purple-100 mb-2">
                                                Confirm Password
                                                <span className="text-orange-400 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.password_confirmation}
                                                    onChange={(e) => updateFormData({ password_confirmation: e.target.value })}
                                                    placeholder="••••••••"
                                                    required
                                                    aria-invalid={!!fieldErrors.password_confirmation}
                                                    aria-describedby={fieldErrors.password_confirmation ? "confirm-error" : undefined}
                                                    className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3.5 text-purple-300/50 hover:text-purple-200 transition-colors"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {fieldErrors.password_confirmation && (
                                                <p id="confirm-error" className="text-red-300 text-xs mt-1.5">
                                                    {fieldErrors.password_confirmation}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-500/50 disabled:to-orange-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-900 mt-6"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Resetting Password...
                                                </span>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* Back to Login */}
                            {!successMessage && (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full mt-6 py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:text-orange-400 group"
                                >
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    Back to Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
