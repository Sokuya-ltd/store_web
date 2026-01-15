import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, Clock, Copy, Check } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { colors } from "../../lib/colors";

export default function AccountSecurityForm() {
    const toast = useToast();
    
    // Change Password State
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        password_confirmation: "",
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});

    // 2FA State
    const [twoFALoading, setTwoFALoading] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpErrors, setOtpErrors] = useState(null);

    // Email Verification State
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(true);
    const [userEmail, setUserEmail] = useState("user@example.com");

    // Copy to Clipboard State
    const [copiedId, setCopiedId] = useState(null);

    // Password Strength Calculator
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(passwordForm.new_password);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

    // Copy to Clipboard
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Mask email
    const maskEmail = (email) => {
        const [local, domain] = email.split("@");
        const maskedLocal = local.substring(0, 2) + "***" + local.substring(local.length - 1);
        return `${maskedLocal}@${domain}`;
    };

    // Audit Log State
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditLogsLoading, setAuditLogsLoading] = useState(false);
    const [auditLogsPagination, setAuditLogsPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 50,
        last_page: 1,
    });

    // Change Password Handler
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordErrors({});

        try {
            // Validate passwords match
            if (passwordForm.new_password !== passwordForm.password_confirmation) {
                setPasswordErrors({ password_confirmation: "Passwords do not match" });
                toast.error("Passwords do not match");
                setPasswordLoading(false);
                return;
            }

            // Validate password strength
            if (passwordForm.new_password.length < 8) {
                setPasswordErrors({ new_password: "Password must be at least 8 characters" });
                toast.error("Password must be at least 8 characters");
                setPasswordLoading(false);
                return;
            }

            const response = await api.post("/store/change-password", {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
                new_password_confirmation: passwordForm.password_confirmation,
            });

            // Show success toast with the message from response
            toast.success(response.message || "Password changed successfully!");
            
            // Reset form
            setPasswordForm({
                current_password: "",
                new_password: "",
                password_confirmation: "",
            });
            setShowPasswords({
                current: false,
                new: false,
                confirm: false,
            });
        } catch (err) {
            // Handle validation errors (422)
            if (err.status === 422 && err.errors) {
                setPasswordErrors(
                    Object.entries(err.errors).reduce(
                        (acc, [field, msgs]) => ({
                            ...acc,
                            [field]: msgs[0],
                        }),
                        {}
                    )
                );
                toast.error(err.message || "Validation failed");
            } 
            // Handle unauthorized (401)
            else if (err.status === 401) {
                toast.error("Session expired. Please log in again.");
            } 
            // Handle other errors
            else {
                toast.error(err.message || "Failed to change password");
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    // Enable 2FA Handler
    const handleEnable2FA = async () => {
        setTwoFALoading(true);
        try {
            const response = await api.post("/store/2fa/enable", {});

            // Show OTP input for verification
            setShowOTPInput(true);
            toast.success("Check your email for a verification code");
        } catch (err) {
            toast.error(err.message || "Failed to enable 2FA");
        } finally {
            setTwoFALoading(false);
        }
    };

    // Verify 2FA OTP Handler
    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setTwoFALoading(true);
        setOtpErrors(null);

        try {
            const response = await api.post("/store/2fa/verify", {
                otp_code: otpCode,
            });

            setTwoFAEnabled(true);
            setShowOTPInput(false);
            setOtpCode("");
            toast.success(response.message || "Two-Factor Authentication enabled successfully!");
        } catch (err) {
            setOtpErrors(err.message || "Invalid verification code");
            toast.error("Invalid verification code");
        } finally {
            setTwoFALoading(false);
        }
    };

    // Disable 2FA Handler
    const handleDisable2FA = async () => {
        if (!window.confirm("Are you sure? This will disable two-factor authentication.")) {
            return;
        }

        setTwoFALoading(true);
        try {
            const response = await api.post("/store/2fa/disable", {});
            setTwoFAEnabled(false);
            toast.success(response.message || "Two-Factor Authentication disabled");
        } catch (err) {
            toast.error(err.message || "Failed to disable 2FA");
        } finally {
            setTwoFALoading(false);
        }
    };

    // Resend Email Verification Handler
    const handleResendVerification = async () => {
        setEmailVerificationLoading(true);
        try {
            const response = await api.post("/store/email/resend-verification", {});
            toast.success(response.message || "Verification email sent. Please check your inbox.");
        } catch (err) {
            toast.error(err.message || "Failed to send verification email");
        } finally {
            setEmailVerificationLoading(false);
        }
    };

    // Fetch Audit Logs Handler
    const fetchAuditLogs = async (page = 1) => {
        setAuditLogsLoading(true);
        try {
            const response = await api.get(`/store/audit/by-type?types=security&page=${page}`);
            setAuditLogs(response.data?.data || []);
            setAuditLogsPagination({
                current_page: response.data?.current_page || 1,
                total: response.data?.total || 0,
                per_page: response.data?.per_page || 50,
                last_page: response.data?.last_page || 1,
            });
        } catch (err) {
            // Set empty array on error, don't show error toast as this is supplementary info
            setAuditLogs([]);
        } finally {
            setAuditLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Change Password */}
                <div className="flex-1">
                    {/* Change Password Section */}
                    <Card className="p-4 md:p-6">
                        <form onSubmit={handlePasswordChange} autoComplete="off">
                            <div className="mb-4 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-slate-700" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
                                    <p className="text-sm text-slate-600">Update your password regularly to keep your account secure</p>
                                </div>
                            </div>
                            {/* Warning Banner */}
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-800">
                                    <span className="font-semibold">⚠️ Note:</span> After changing your password, you'll need to log in again with your new password.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwordForm.current_password}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    current_password: e.target.value,
                                                })
                                            }
                                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent text-sm ${passwordErrors.current_password
                                                ? "border-red-500"
                                                : "border-slate-300"
                                                }`}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    current: !showPasswords.current,
                                                })
                                            }
                                            className="absolute right-3 top-2.5 text-slate-600 hover:text-slate-900"
                                        >
                                            {showPasswords.current ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordErrors.current_password && (
                                        <p className="text-xs text-red-600 mt-1">{passwordErrors.current_password}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordForm.new_password}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    new_password: e.target.value,
                                                })
                                            }
                                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent text-sm ${passwordErrors.new_password
                                                ? "border-red-500"
                                                : "border-slate-300"
                                                }`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    new: !showPasswords.new,
                                                })
                                            }
                                            className="absolute right-3 top-2.5 text-slate-600 hover:text-slate-900"
                                        >
                                            {showPasswords.new ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {passwordForm.new_password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${strengthColors[Math.max(0, passwordStrength - 1)]}`}
                                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">
                                                    {strengthLabels[passwordStrength]}
                                                </span>
                                            </div>

                                            {/* Requirements Checklist */}
                                            <div className="space-y-1 text-xs text-slate-600">
                                                <div className={passwordForm.new_password.length >= 8 ? "text-green-600" : ""}>
                                                    {passwordForm.new_password.length >= 8 ? "✓" : "○"} At least 8 characters
                                                </div>
                                                <div className={/[a-z]/.test(passwordForm.new_password) && /[A-Z]/.test(passwordForm.new_password) ? "text-green-600" : ""}>
                                                    {/[a-z]/.test(passwordForm.new_password) && /[A-Z]/.test(passwordForm.new_password) ? "✓" : "○"} Mix of uppercase and lowercase
                                                </div>
                                                <div className={/\d/.test(passwordForm.new_password) ? "text-green-600" : ""}>
                                                    {/\d/.test(passwordForm.new_password) ? "✓" : "○"} Contains numbers
                                                </div>
                                                <div className={/[^a-zA-Z\d]/.test(passwordForm.new_password) ? "text-green-600" : ""}>
                                                    {/[^a-zA-Z\d]/.test(passwordForm.new_password) ? "✓" : "○"} Contains special characters
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {passwordErrors.new_password && (
                                        <p className="text-xs text-red-600 mt-1">{passwordErrors.new_password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordForm.password_confirmation}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    password_confirmation: e.target.value,
                                                })
                                            }
                                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent text-sm ${passwordErrors.password_confirmation
                                                ? "border-red-500"
                                                : "border-slate-300"
                                                }`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords({
                                                    ...showPasswords,
                                                    confirm: !showPasswords.confirm,
                                                })
                                            }
                                            className="absolute right-3 top-2.5 text-slate-600 hover:text-slate-900"
                                        >
                                            {showPasswords.confirm ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-xs text-red-600 mt-1">{passwordErrors.password_confirmation}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full py-2 px-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: colors.primary.main }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary.dark}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary.main}
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Right Column - 2FA and Email Verification */}
                <div className="flex-1 space-y-6">
                    {/* Two-Factor Authentication Section */}
                    <Card className="p-4 md:p-6">
                        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-slate-700" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
                                        <p className="text-sm text-slate-600">
                                            {twoFAEnabled ? "Enabled - Extra layer of security" : "Add extra security to your account"}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1-full text-xs font-medium ${twoFAEnabled
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {twoFAEnabled ? "Enabled" : "Disabled"}
                                </div>
                            </div>

                            {!showOTPInput ? (
                                <div className="flex items-center justify-center py-4">
                                    <span className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded text-sm">
                                        Coming Soon
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Enter the verification code sent to your email
                                    </p>
                                    <div>
                                        <input
                                            type="text"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="000000"
                                            maxLength="6"
                                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent text-sm text-center tracking-widest font-mono ${otpErrors ? "border-red-500" : "border-slate-300"
                                                }`}
                                        />
                                        {otpErrors && (
                                            <p className="text-xs text-red-600 mt-1">{otpErrors}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowOTPInput(false);
                                                setOtpCode("");
                                                setOtpErrors(null);
                                            }}
                                            className="flex-1 py-2 px-4 border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleVerify2FA}
                                            disabled={twoFALoading || otpCode.length !== 6}
                                            className="flex-1 py-2 px-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: colors.accent.olive }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5d29'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent.olive}
                                        >
                                            {twoFALoading ? "Verifying..." : "Verify Code"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Card>

                    {/* Email Verification Section */}
                    <Card className="p-4 md:p-6">
                        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-6 h-6 text-slate-700" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Email Verification</h3>
                                        <p className="text-sm text-slate-600">Verify your email address</p>
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1 text-xs font-medium rounded ${emailVerified
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {emailVerified ? "Verified" : "Not Verified"}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-slate-600 font-medium mb-1">Email Address</p>
                                <p className="text-sm text-slate-900 font-mono">{maskEmail(userEmail)}</p>
                            </div>

                            <p className="text-sm text-slate-600 mb-4">
                                {emailVerified
                                    ? "Your email is verified and secure."
                                    : "Please verify your email to secure your account."}
                            </p>

                            {!emailVerified && (
                                <Button
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={emailVerificationLoading}
                                    className="w-full py-2 px-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: colors.accent.olive }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5d29'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent.olive}
                                >
                                    {emailVerificationLoading ? "Sending..." : "Resend Verification Email"}
                                </Button>
                            )}
                        </form>
                    </Card>
                </div>
            </div>

            {/* Bottom Section - Audit Logs */}
            <div className="w-full mt-6">
                <Card className="p-4 md:p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-slate-700" />
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Account Audit Logs</h3>
                            <p className="text-sm text-slate-600">Recent security-related activities on your account</p>
                        </div>
                    </div>

                    {auditLogsLoading ? (
                        <p className="text-slate-600 text-sm">Loading audit logs...</p>
                    ) : auditLogs.length === 0 ? (
                        <p className="text-slate-600 text-sm">No recent activities found.</p>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="px-4 py-2 text-left font-semibold text-slate-900">Date</th>
                                            <th className="px-4 py-2 text-left font-semibold text-slate-900">Activity</th>
                                            <th className="px-4 py-2 text-left font-semibold text-slate-900">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {auditLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-2 text-slate-600 text-xs">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-slate-600 text-xs">
                                                    {log.event.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </td>
                                                <td className="px-4 py-2 text-slate-600">
                                                    <div className="flex items-center gap-2 group">
                                                        <span className="text-xs font-mono">{log.ip_address}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(log.ip_address, log.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                                                            title="Copy IP address"
                                                        >
                                                            {copiedId === log.id ? (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-xs text-slate-600">
                                    Showing {auditLogs.length > 0 ? (auditLogsPagination.current_page - 1) * auditLogsPagination.per_page + 1 : 0} to {Math.min(auditLogsPagination.current_page * auditLogsPagination.per_page, auditLogsPagination.total)} of {auditLogsPagination.total} entries
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchAuditLogs(auditLogsPagination.current_page - 1)}
                                        disabled={auditLogsPagination.current_page === 1 || auditLogsLoading}
                                        className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: auditLogsPagination.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => fetchAuditLogs(page)}
                                                disabled={auditLogsLoading}
                                                className="px-2 py-1 text-xs rounded transition-colors border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    backgroundColor: auditLogsPagination.current_page === page ? colors.accent.olive : 'transparent',
                                                    color: auditLogsPagination.current_page === page ? 'white' : '#6b7280',
                                                    fontWeight: auditLogsPagination.current_page === page ? '600' : 'normal',
                                                    borderColor: auditLogsPagination.current_page === page ? colors.accent.olive : '#d1d5db'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => fetchAuditLogs(auditLogsPagination.current_page + 1)}
                                        disabled={auditLogsPagination.current_page === auditLogsPagination.last_page || auditLogsLoading}
                                        className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}
