import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../lib/colors";
import { Mail, Lock, Eye, EyeOff, Facebook, Instagram, Twitch } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex flex-col lg:items-center lg:justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

            <ToastContainer toasts={toasts} onClose={hideToast} />

            <div className="w-full max-w-6xl relative z-10 flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Content - Welcome Section */}
                    <div className="flex flex-col justify-center order-2 lg:order-1">
                        <div className="text-white space-y-6">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-3">
                                    Welcome!
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                            </div>
                            
                            <p className="text-lg text-purple-200 leading-relaxed">
                                Manage your store effortlessly. Access your dashboard, track orders, manage inventory, and grow your business with powerful tools designed for sellers.
                            </p>

                            <button
                                onClick={() => window.open("https://sokuya.com/learn", "_blank")}
                                className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-900 w-fit"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Login Form */}
                    <div className="order-1 lg:order-2 animate-slide-up">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Sign in
                            </h2>
                            <p className="text-sm text-purple-200 mb-8">
                                Enter your credentials to access your dashboard
                            </p>

                            {/* Error Message */}
                            {error && !showVerificationMessage && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg animate-shake">
                                    <p className="text-red-200 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Verification Required Message */}
                            {showVerificationMessage ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-500/20 border border-amber-400/50 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-semibold text-amber-100 mb-1">Email Verification Required</h3>
                                                <p className="text-sm text-amber-50 mb-3">
                                                    Your account is not yet verified. Please check your email inbox and click the verification link to activate your account.
                                                </p>
                                                <p className="text-xs text-amber-100/80">
                                                    Didn't receive the email? Check your spam folder or request a new verification link.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                // TODO: Implement resend verification email
                                                showSuccess("Verification email resent! Please check your inbox.");
                                            }}
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 font-semibold rounded-lg transition-all"
                                        >
                                            Resend Verification Email
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setShowVerificationMessage(false)}
                                            className="text-sm text-purple-200 hover:text-white underline transition-colors"
                                        >
                                            Try with a different account
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-purple-100 mb-2">
                                            User Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateFormData({ email: e.target.value })}
                                                placeholder="you@example.com"
                                                required
                                                aria-invalid={!!fieldErrors.email}
                                                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                                                className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                                            />
                                            <Mail className="absolute right-3 top-3.5 w-5 h-5 text-purple-300/50" />
                                        </div>
                                        {fieldErrors.email && (
                                            <p id="email-error" className="text-red-300 text-xs mt-1.5">
                                                {fieldErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
                                            Password
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

                                    {/* Forgot Password Link */}
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-500/50 disabled:to-orange-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-900"
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
                                            "Submit"
                                        )}
                                    </button>

                                    {/* Social Login Divider */}
                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/20"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 text-purple-300">Or connect with</span>
                                        </div>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => window.open("https://facebook.com", "_blank")}
                                            className="p-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all hover:scale-110"
                                            aria-label="Sign in with Facebook"
                                        >
                                            <Facebook className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open("https://instagram.com", "_blank")}
                                            className="p-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all hover:scale-110"
                                            aria-label="Sign in with Instagram"
                                        >
                                            <Instagram className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open("https://twitch.tv", "_blank")}
                                            className="p-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all hover:scale-110"
                                            aria-label="Sign in with Twitch"
                                        >
                                            <Twitch className="w-5 h-5 text-white" />
                                        </button>
                                    </div>

                                    {/* Register Link */}
                                    <p className="text-center text-sm text-purple-200 pt-2">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/onboarding"
                                            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                                        >
                                            Register here
                                        </Link>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
