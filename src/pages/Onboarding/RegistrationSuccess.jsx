import { useLocation, useNavigate, Navigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function RegistrationSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return <Navigate to="/onboarding" replace />;
    }

    const { store_owner, next_steps } = data;

    return (
        <div className="min-h-screen bg-linear-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>

            <div className="max-w-lg w-full relative z-10">
                <div className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                    {/* Logo */}
                    <img src={logo} alt="Sokuya" className="h-40 w-auto mx-auto mb-6" />


                    {/* Success Message */}
                    <h1 className="text-2xl font-bold text-white mb-2">Registration Successful! 🎉</h1>
                    <p className="text-neutral-300 mb-6">
                        Welcome to Sokuya, <span className="font-semibold text-white">{store_owner?.name}</span>!
                        <br />
                        Your store <span className="font-semibold text-orange-400">"{store_owner?.store_name}"</span> has been created.
                    </p>

                    {/* Account Details */}
                    <div className="bg-white/6 border border-white/10 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-medium text-neutral-200 mb-2">Account Details</h3>
                        <div className="space-y-1 text-sm text-neutral-400">
                            <p><span className="text-neutral-500">Email:</span> {store_owner?.email}</p>
                            <p><span className="text-neutral-500">Store ID:</span> <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">{store_owner?.id}</code></p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-medium text-orange-300 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Next Steps
                        </h3>
                        <ul className="space-y-3">
                            {next_steps?.verify_email && (
                                <li className="flex items-start gap-3">
                                    <span className="shrink-0 w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    <div>
                                        <p className="font-medium text-white">Verify Your Email</p>
                                        <p className="text-sm text-neutral-400">{next_steps.verify_email}</p>
                                    </div>
                                </li>
                            )}
                            {next_steps?.upload_documents && (
                                <li className="flex items-start gap-3">
                                    <span className="shrink-0 w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    <div>
                                        <p className="font-medium text-white">Upload Documents</p>
                                        <p className="text-sm text-neutral-400">{next_steps.upload_documents}</p>
                                    </div>
                                </li>
                            )}
                            {next_steps?.setup_products && (
                                <li className="flex items-start gap-3">
                                    <span className="shrink-0 w-6 h-6 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                    <div>
                                        <p className="font-medium text-white">Setup Products</p>
                                        <p className="text-sm text-neutral-400">{next_steps.setup_products}</p>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Email Reminder */}
                    <div className="bg-white/6 border border-white/10 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-neutral-300 text-left">
                            We've sent a verification email to <strong className="text-white">{store_owner?.email}</strong>.
                            Please check your inbox and spam folder.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-navy-900"
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={() => navigate("/onboarding")}
                            className="w-full text-neutral-400 hover:text-white text-sm transition-colors"
                        >
                            Register Another Store
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}