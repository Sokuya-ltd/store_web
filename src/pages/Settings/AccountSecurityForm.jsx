import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, Clock, Copy, Check } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import SettingsCard from "../../components/ui/SettingsCard";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

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
                    <SettingsCard className="p-4 md:p-6">
                        <form onSubmit={handlePasswordChange} autoComplete="off">
                            <div className="mb-4 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-neutral-400" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                                    <p className="text-sm text-neutral-400">Update your password regularly to keep your account secure</p>
                                </div>
                            </div>
                            {/* Warning Banner */}
                            <div className="my-7 p-3 bg-amber-500/10 border border-amber-400/30 rounded-lg">
                                <p className="text-xs text-amber-300">
                                    <span className="font-semibold">⚠️ Note:</span> After changing your password, you'll need to log in again with your new password.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-200 mb-1">Current Password</label>
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
                                            className={`w-full bg-white/10 border text-white placeholder-neutral-500 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm ${passwordErrors.current_password
                                                ? "border-red-500"
                                                : "border-white/20"
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
                                            className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
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
                                    <label className="block text-sm font-medium text-neutral-200 mb-1">New Password</label>
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
                                            className={`w-full bg-white/10 border text-white placeholder-neutral-500 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm ${passwordErrors.new_password
                                                ? "border-red-500"
                                                : "border-white/20"
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
                                            className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
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
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${strengthColors[Math.max(0, passwordStrength - 1)]}`}
                                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-neutral-400">
                                                    {strengthLabels[passwordStrength]}
                                                </span>
                                            </div>

                                            {/* Requirements Checklist */}
                                            <div className="space-y-1 text-xs text-neutral-400">
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
                                    <label className="block text-sm font-medium text-neutral-200 mb-1">Confirm Password</label>
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
                                            className={`w-full bg-white/10 border text-white placeholder-neutral-500 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm ${passwordErrors.password_confirmation
                                                ? "border-red-500"
                                                : "border-white/20"
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
                                            className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
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
                                    className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </SettingsCard>
                </div>

                {/* Right Column - 2FA and Email Verification */}
                <div className="flex-1 space-y-6">
                    {/* Two-Factor Authentication Section */}
                    <SettingsCard className="p-4 md:p-6">
                        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-neutral-400" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                                        <p className="text-sm text-neutral-400">
                                            {twoFAEnabled ? "Enabled - Extra layer of security" : "Add extra security to your account"}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1-full text-xs font-medium rounded ${twoFAEnabled
                                        ? "bg-green-400/20 text-green-300"
                                        : "bg-yellow-400/20 text-yellow-300"
                                        }`}
                                >
                                    {twoFAEnabled ? "Enabled" : "Disabled"}
                                </div>
                            </div>

                            {!showOTPInput ? (
                                <div className="flex items-center justify-center py-4">
                                    <span className="px-4 py-2 bg-white/10 text-neutral-300 font-semibold rounded text-sm">
                                        Coming Soon
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-neutral-400">
                                    </p>
                                    <div>
                                        <input
                                            type="text"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="000000"
                                            maxLength="6"
                                            className={`w-full bg-white/10 border text-white placeholder-neutral-500 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-center tracking-widest font-mono ${otpErrors ? "border-red-500" : "border-white/20"
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
                                            className="flex-1 py-2 px-4 border border-white/20 text-neutral-200 font-semibold hover:bg-white/10 rounded"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleVerify2FA}
                                            disabled={twoFALoading || otpCode.length !== 6}
                                            className="flex-1 py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                        >
                                            {twoFALoading ? "Verifying..." : "Verify Code"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </SettingsCard>

                    {/* Email Verification Section */}
                    <SettingsCard className="p-4 md:p-6">
                        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-neutral-400" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Email Verification</h3>
                                        <p className="text-sm text-neutral-400">Verify your email address</p>
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1 text-xs font-medium rounded ${emailVerified
                                        ? "bg-green-400/20 text-green-300"
                                        : "bg-red-400/20 text-red-300"
                                        }`}
                                >
                                    {emailVerified ? "Verified" : "Not Verified"}
                                </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-lg mb-4">
                                <p className="text-xs text-neutral-400 font-medium mb-1">Email Address</p>
                                <p className="text-sm text-white font-mono">{maskEmail(userEmail)}</p>
                            </div>

                            <p className="text-sm text-neutral-400 mb-4">
                                {emailVerified
                                    ? "Your email is verified and secure."
                                    : "Please verify your email to secure your account."}
                            </p>

                            {!emailVerified && (
                                <Button
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={emailVerificationLoading}
                                    className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {emailVerificationLoading ? "Sending..." : "Resend Verification Email"}
                                </Button>
                            )}
                        </form>
                    </SettingsCard>
                </div>
            </div>

            {/* Bottom Section - Audit Logs */}
            <div className="w-full mt-6">
                <SettingsCard className="p-4 md:p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-neutral-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Account Audit Logs</h3>
                            <p className="text-sm text-neutral-400">Recent security-related activities on your account</p>
                        </div>
                    </div>

                    {auditLogsLoading ? (
                        <p className="text-neutral-400 text-sm">Loading audit logs...</p>
                    ) : auditLogs.length === 0 ? (
                        <p className="text-neutral-400 text-sm">No recent activities found.</p>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="px-4 py-2 text-left font-semibold text-neutral-300">Date</th>
                                            <th className="px-4 py-2 text-left font-semibold text-neutral-300">Activity</th>
                                            <th className="px-4 py-2 text-left font-semibold text-neutral-300">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {auditLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-2 text-neutral-400 text-xs">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 text-neutral-400 text-xs">
                                                    {log.event.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </td>
                                                <td className="px-4 py-2 text-neutral-400">
                                                    <div className="flex items-center gap-2 group">
                                                        <span className="text-xs font-mono">{log.ip_address}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(log.ip_address, log.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-neutral-300"
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
                                <p className="text-xs text-neutral-400">
                                    Showing {auditLogs.length > 0 ? (auditLogsPagination.current_page - 1) * auditLogsPagination.per_page + 1 : 0} to {Math.min(auditLogsPagination.current_page * auditLogsPagination.per_page, auditLogsPagination.total)} of {auditLogsPagination.total} entries
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchAuditLogs(auditLogsPagination.current_page - 1)}
                                        disabled={auditLogsPagination.current_page === 1 || auditLogsLoading}
                                        className="px-3 py-1 text-sm border border-white/20 text-neutral-300 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: auditLogsPagination.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => fetchAuditLogs(page)}
                                                disabled={auditLogsLoading}
                                                className={`px-2 py-1 text-xs rounded transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    auditLogsPagination.current_page === page
                                                        ? 'bg-orange-400 border-orange-400 text-white font-semibold'
                                                        : 'border-white/20 text-neutral-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => fetchAuditLogs(auditLogsPagination.current_page + 1)}
                                        disabled={auditLogsPagination.current_page === auditLogsPagination.last_page || auditLogsLoading}
                                        className="px-3 py-1 text-sm border border-white/20 text-neutral-300 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </SettingsCard>
            </div>
        </>
    );
}
