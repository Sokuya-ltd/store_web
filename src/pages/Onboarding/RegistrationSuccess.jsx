import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { colors } from "../../lib/colors";

export default function RegistrationSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    // If no data, redirect to onboarding
    if (!data) {
        return <Navigate to="/onboarding" replace />;
    }

    const { store_owner, next_steps } = data;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: colors.primary.main }}>
            <div className="max-w-lg w-full bg-white shadow-xl p-8 text-center animate-slide-up">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Registration Successful! 🎉
                </h1>
                <p className="text-slate-600 mb-6">
                    Welcome to Sokuya, <span className="font-semibold">{store_owner?.name}</span>!
                    <br />
                    Your store <span style={{ color: colors.primary.main }} className="font-semibold">"{store_owner?.store_name}"</span> has been created.
                </p>

                {/* Store Owner Info */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-medium text-slate-700 mb-2">Account Details</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                        <p><span className="text-slate-500">Email:</span> {store_owner?.email}</p>
                        <p><span className="text-slate-500">Store ID:</span> <code className="text-xs bg-slate-200 px-1 rounded">{store_owner?.id}</code></p>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Next Steps
                    </h3>
                    <ul className="space-y-3">
                        {next_steps?.verify_email && (
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <div>
                                    <p className="font-medium text-slate-800">Verify Your Email</p>
                                    <p className="text-sm text-slate-600">{next_steps.verify_email}</p>
                                </div>
                            </li>
                        )}
                        {next_steps?.upload_documents && (
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <div>
                                    <p className="font-medium text-slate-800">Upload Documents</p>
                                    <p className="text-sm text-slate-600">{next_steps.upload_documents}</p>
                                </div>
                            </li>
                        )}
                        {next_steps?.setup_products && (
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <div>
                                    <p className="font-medium text-slate-800">Setup Products</p>
                                    <p className="text-sm text-slate-600">{next_steps.setup_products}</p>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Email Reminder */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-blue-800 text-left">
                        We've sent a verification email to <strong>{store_owner?.email}</strong>. 
                        Please check your inbox and spam folder.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Button
                        onClick={() => navigate("/login")}
                        className="w-full text-white py-3"
                        style={{ backgroundColor: colors.primary.main }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary.dark}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary.main}
                    >
                        Go to Login
                    </Button>
                    <button
                        onClick={() => navigate("/onboarding")}
                        className="w-full text-slate-600 hover:text-slate-800 text-sm underline"
                    >
                        Register Another Store
                    </button>
                </div>
            </div>
        </div>
    );
}
