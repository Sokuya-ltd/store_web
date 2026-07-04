import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function getPasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak — add numbers or uppercase", color: "bg-red-400" };
    if (score === 2) return { score, label: "Fair — add uppercase or a symbol", color: "bg-orange-400" };
    if (score === 3) return { score, label: "Good — add a symbol to make it great", color: "bg-yellow-400" };
    if (score === 4) return { score, label: "Strong", color: "bg-green-400" };
    return { score: 5, label: "Very Strong", color: "bg-green-500" };
}

function isUKPhone(phone) {
    return /^(\+44|0)[0-9]{9,10}$/.test(phone.replace(/\s/g, ""));
}

export default function StepBusinessInfo({ data, updateData, clearFieldError, onSubmit, isSubmitting, error, fieldErrors = {} }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsError, setTermsError] = useState("");
    const [phoneHint, setPhoneHint] = useState(false);
    const [step1Errors, setStep1Errors] = useState({});

    const strength = getPasswordStrength(data.password);
    const passwordsMatch =
        data.password && data.password_confirmation && data.password === data.password_confirmation;

    const validateStep1 = () => {
        const errors = {};
        if (!data.name?.trim()) errors.name = "Full name is required";
        if (!data.email?.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Enter a valid email";
        if (!data.phone?.trim()) errors.phone = "Phone number is required";
        if (!data.password) errors.password = "Password is required";
        else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
        if (!data.password_confirmation) errors.password_confirmation = "Please confirm your password";
        else if (data.password !== data.password_confirmation) errors.password_confirmation = "Passwords do not match";
        setStep1Errors(errors);
        if (!acceptedTerms) setTermsError("You must accept the terms to continue");
        return Object.keys(errors).length === 0 && acceptedTerms;
    };

    const handleContinue = () => {
        if (validateStep1()) setCurrentStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit();
    };

    const GlassInput = ({ label, type = "text", value, onChange, onBlur, error: inputError, placeholder, required, name, numStep }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-neutral-200 mb-2">
                {label}
                {required && <span className="text-orange-400 ml-1">*</span>}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                required={required}
                step={numStep}
                aria-invalid={!!inputError}
                aria-describedby={inputError ? `${name}-error` : undefined}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
            />
            {inputError && (
                <p id={`${name}-error`} className="text-red-300 text-xs mt-1.5">{inputError}</p>
            )}
        </div>
    );

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Step Progress Indicator */}
            <div className="flex items-center mb-8">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 1 ? "bg-orange-400 text-white" : "bg-white/10 text-neutral-400"}`}>
                        {currentStep > 1 ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : "1"}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === 1 ? "text-orange-400" : "text-neutral-400"}`}>
                        Your account
                    </span>
                </div>
                <div className={`flex-1 h-px mx-4 transition-colors ${currentStep > 1 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 2 ? "bg-orange-400 text-white" : "bg-white/10 text-neutral-400"}`}>
                        2
                    </div>
                    <span className={`text-sm font-medium ${currentStep === 2 ? "text-orange-400" : "text-neutral-400"}`}>
                        Store details
                    </span>
                </div>
            </div>

            {/* ── STEP 1: Account ── */}
            {currentStep === 1 && (
                <>
                    <GlassInput
                        label="Full Name"
                        name="name"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        onBlur={() => clearFieldError("name")}
                        error={step1Errors.name || fieldErrors.name}
                        placeholder="John Doe"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassInput
                            label="Email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            onBlur={() => clearFieldError("email")}
                            error={step1Errors.email || fieldErrors.email}
                            placeholder="you@example.com"
                            required
                        />

                        {/* Phone with format hint */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-neutral-200 mb-2">
                                Phone <span className="text-orange-400">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone || ""}
                                onChange={(e) => updateData({ phone: e.target.value })}
                                onFocus={() => setPhoneHint(true)}
                                onBlur={() => {
                                    setPhoneHint(false);
                                    clearFieldError("phone");
                                }}
                                placeholder="+44 7xxx xxxxxx"
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
                            />
                            {(step1Errors.phone || fieldErrors.phone) && (
                                <p className="text-red-300 text-xs mt-1.5">{step1Errors.phone || fieldErrors.phone}</p>
                            )}
                            {phoneHint && !step1Errors.phone && data.phone && !isUKPhone(data.phone) && (
                                <p className="text-orange-300 text-xs mt-1.5">Use format +44 7xxx xxxxxx</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
                            Password <span className="text-orange-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password || ""}
                                onChange={(e) => updateData({ password: e.target.value })}
                                onBlur={() => clearFieldError("password")}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {data.password && (
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-white/10"}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs mt-1 ${strength.score <= 2 ? "text-red-300" : strength.score === 3 ? "text-yellow-300" : "text-green-400"}`}>
                                    {strength.label}
                                </p>
                            </div>
                        )}
                        {(step1Errors.password || fieldErrors.password) && (
                            <p className="text-red-300 text-xs mt-1.5">{step1Errors.password || fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-200 mb-2">
                            Confirm Password <span className="text-orange-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation || ""}
                                onChange={(e) => updateData({ password_confirmation: e.target.value })}
                                onBlur={() => clearFieldError("password_confirmation")}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {data.password_confirmation && (
                            <p className={`text-xs mt-1.5 ${passwordsMatch ? "text-green-400" : "text-red-300"}`}>
                                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                            </p>
                        )}
                        {(step1Errors.password_confirmation || fieldErrors.password_confirmation) && !data.password_confirmation && (
                            <p className="text-red-300 text-xs mt-1.5">
                                {step1Errors.password_confirmation || fieldErrors.password_confirmation}
                            </p>
                        )}
                    </div>
                                    {strength.label}
                                </p>
                            </div>
                        )}
                        {(step1Errors.password || fieldErrors.password) && (
                            <p className="text-red-300 text-xs mt-1.5">{step1Errors.password || fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-neutral-200 mb-2">
                            Confirm Password <span className="text-orange-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation || ""}
                                onChange={(e) => updateData({ password_confirmation: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {data.password_confirmation && (
                            <p className={`text-xs mt-1.5 ${passwordsMatch ? "text-green-400" : "text-red-300"}`}>
                                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                            </p>
                        )}
                        {(step1Errors.password_confirmation || fieldErrors.password_confirmation) && !data.password_confirmation && (
                            <p className="text-red-300 text-xs mt-1.5">
                                {step1Errors.password_confirmation || fieldErrors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="space-y-2 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => {
                                    setAcceptedTerms(e.target.checked);
                                    if (e.target.checked) setTermsError("");
                                }}
                                className="mt-1 w-4 h-4 accent-orange-500 rounded border border-white/30 bg-white/10 cursor-pointer focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-sm text-neutral-300">
                                I agree to the{" "}
                                <Link to="/terms" className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors">
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {termsError && <p className="text-red-300 text-xs ml-7">{termsError}</p>}
                    </div>

                    {/* Continue CTA */}
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full py-3 px-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-navy-900 mt-6 flex items-center justify-center gap-2"
                    >
                        Continue to store details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <p className="text-center text-sm text-neutral-400 pt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </>
            )}

            {/* ── STEP 2: Store Details ── */}
            {currentStep === 2 && (
                <>
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                            <p className="text-red-200 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <GlassInput
                        label="Store Name"
                        name="store_name"
                        value={data.store_name}
                        onChange={(e) => updateData({ store_name: e.target.value })}
                        onBlur={() => clearFieldError("store_name")}
                        error={fieldErrors.store_name}
                        placeholder="My Awesome Store"
                        required
                    />

                    {/* Registration Number — optional */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-200 mb-2">
                            Registration Number
                            <span className="text-neutral-500 text-xs font-normal">(optional)</span>
                            <div className="relative group">
                                <svg className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 w-52 text-center pointer-events-none">
                                    Companies House number — only required for registered businesses
                                </div>
                            </div>
                        </label>
                        <input
                            type="text"
                            name="business_registration_number"
                            value={data.business_registration_number || ""}
                            onChange={(e) => updateData({ business_registration_number: e.target.value })}
                            onBlur={() => clearFieldError("business_registration_number")}
                            placeholder="e.g., 12345678"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all backdrop-blur-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassInput
                            label="Commission Rate (%)"
                            type="number"
                            name="commission_rate"
                            numStep="0.1"
                            value={data.commission_rate ?? ""}
                            onChange={(e) => updateData({ commission_rate: parseFloat(e.target.value) || 0 })}
                            onBlur={() => clearFieldError("commission_rate")}
                            error={fieldErrors.commission_rate}
                            placeholder="15.5"
                        />
                        <GlassInput
                            label="Minimum Order (£)"
                            type="number"
                            name="minimum_order_amount"
                            numStep="0.01"
                            value={data.minimum_order_amount ?? ""}
                            onChange={(e) => updateData({ minimum_order_amount: parseFloat(e.target.value) || 0 })}
                            onBlur={() => clearFieldError("minimum_order_amount")}
                            error={fieldErrors.minimum_order_amount}
                            placeholder="0.00"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-400/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-navy-900 mt-2"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating Store...
                            </span>
                        ) : (
                            "Create Store"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full text-neutral-400 hover:text-white text-sm transition-colors text-center pt-1"
                    >
                        ← Back to account details
                    </button>
                </>
            )}
        </form>
    );
}