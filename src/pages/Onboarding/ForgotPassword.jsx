import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import ToastContainer from "../../components/ui/ToastContainer";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setEmailError("");

        // Validation
        if (!email) {
            setEmailError("Email is required");
            setIsSubmitting(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            setIsSubmitting(false);
            return;
        }

        try {
            // Call forgot password endpoint
            const response = await api.post("/store/forgot-password", { email });

            showSuccess(response.message || "Password reset link sent to your email!");
            setSuccessMessage(true);

            // Optionally navigate after delay
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 3000);
        } catch (err) {
            showError(err.message || "Failed to send reset link", 8000);
            setError(err.message || "Failed to send reset link. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>

            <ToastContainer toasts={toasts} onClose={hideToast} />

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center order-2 lg:order-1">
                        <div className="text-white space-y-6">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-3">
                                    Password Recovery
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                            </div>

                            <p className="text-lg text-purple-200 leading-relaxed">
                                Don't worry! It happens to the best of us. Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-orange-400">What happens next?</h3>
                                <ul className="space-y-2 text-purple-200">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-400 font-bold">1</span>
                                        <span>Enter your email address below</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-400 font-bold">2</span>
                                        <span>Check your inbox for a reset link</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-400 font-bold">3</span>
                                        <span>Click the link and create a new password</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
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
                                            Email Sent!
                                        </h2>
                                        <p className="text-purple-200">
                                            Check your inbox and spam folder for the password reset link.
                                        </p>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <p className="text-xs text-purple-300">
                                            The link will expire in 1 hour for security reasons.
                                        </p>
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Form State
                                <>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Reset Password
                                    </h2>
                                    <p className="text-sm text-purple-200 mb-8">
                                        Enter your email to receive password reset instructions
                                    </p>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                                            <p className="text-red-200 text-sm font-medium">{error}</p>
                                        </div>
                                    )}

                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-purple-100 mb-2">
                                                Email Address
                                                <span className="text-orange-400 ml-1">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (emailError) setEmailError("");
                                                    }}
                                                    placeholder="you@example.com"
                                                    required
                                                    aria-invalid={!!emailError}
                                                    aria-describedby={emailError ? "email-error" : undefined}
                                                    className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                />
                                                <Mail className="absolute right-3 top-3.5 w-5 h-5 text-purple-300/50" />
                                            </div>
                                            {emailError && (
                                                <p id="email-error" className="text-red-300 text-xs mt-1.5">
                                                    {emailError}
                                                </p>
                                            )}
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
                                                    Sending Link...
                                                </span>
                                            ) : (
                                                "Send Reset Link"
                                            )}
                                        </button>

                                        {/* Help Text */}
                                        <div className="p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg">
                                            <p className="text-blue-200 text-xs leading-relaxed">
                                                <span className="font-semibold">💡 Tip:</span> Make sure to check your spam or junk folder if you don't see the email in your inbox.
                                            </p>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Back to Login - Always visible except in success state */}
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
