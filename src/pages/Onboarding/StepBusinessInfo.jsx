import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function StepBusinessInfo({ data, updateData, onSubmit, isSubmitting, error, fieldErrors = {} }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTermsError("");

    // Basic validation
    if (!data.name || !data.email || !data.password || !data.phone || !data.store_name) {
      return;
    }
    if (data.password !== data.password_confirmation) {
      alert("Passwords do not match");
      return;
    }
    if (data.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!acceptedTerms) {
      setTermsError("You must accept the terms and conditions to continue");
      return;
    }

    // Call the submit handler from parent
    await onSubmit();
  };

  // Reusable input component for glass-morphism styling
  const GlassInput = ({ label, type = "text", value, onChange, error, placeholder, required, name, step }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-purple-100 mb-2">
        {label}
        {required && <span className="text-orange-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
      />
      {error && (
        <p id={`${name}-error`} className="text-red-300 text-xs mt-1.5">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* General error message display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
          <p className="text-red-200 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <GlassInput
        label="Full Name"
        type="text"
        name="name"
        value={data.name}
        onChange={(e) => updateData({ name: e.target.value })}
        error={fieldErrors.name}
        placeholder="John Doe"
        required
      />

      {/* Email and Phone - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Email"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          error={fieldErrors.email}
          placeholder="you@example.com"
          required
        />

        <GlassInput
          label="Phone"
          type="tel"
          name="phone"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          error={fieldErrors.phone}
          placeholder="+44 123 456 7890"
          required
        />
      </div>

      {/* Store Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Store Name"
          type="text"
          name="store_name"
          value={data.store_name}
          onChange={(e) => updateData({ store_name: e.target.value })}
          error={fieldErrors.store_name}
          placeholder="My Awesome Store"
          required
        />

        {/* Registration Number */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-purple-100 mb-2">
            Registration Number
            <div className="relative group">
              <svg className="w-4 h-4 text-purple-300/50 hover:text-purple-200 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Companies House Registration Number
              </div>
            </div>
          </label>
          <input
            type="text"
            name="business_registration_number"
            value={data.business_registration_number || ""}
            onChange={(e) => updateData({ business_registration_number: e.target.value })}
            placeholder="e.g., 12345678"
            aria-invalid={!!fieldErrors.business_registration_number}
            aria-describedby={fieldErrors.business_registration_number ? "registration-error" : undefined}
            className="w-full bg-white/10 border border-white/30 text-white placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
          />
          {fieldErrors.business_registration_number && (
            <p id="registration-error" className="text-red-300 text-xs mt-1.5">
              {fieldErrors.business_registration_number}
            </p>
          )}
        </div>
      </div>

      {/* Commission Rate and Minimum Order - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassInput
          label="Commission Rate (%)"
          type="number"
          name="commission_rate"
          step="0.1"
          value={data.commission_rate ?? ""}
          onChange={(e) => updateData({ commission_rate: parseFloat(e.target.value) || 0 })}
          error={fieldErrors.commission_rate}
          placeholder="15.5"
        />

        <GlassInput
          label="Minimum Order Amount (£)"
          type="number"
          name="minimum_order_amount"
          step="0.01"
          value={data.minimum_order_amount ?? ""}
          onChange={(e) => updateData({ minimum_order_amount: parseFloat(e.target.value) || 0 })}
          error={fieldErrors.minimum_order_amount}
          placeholder="0.00"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
          Password
          <span className="text-orange-400 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password || ""}
            onChange={(e) => updateData({ password: e.target.value })}
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
            name="password_confirmation"
            value={data.password_confirmation || ""}
            onChange={(e) => updateData({ password_confirmation: e.target.value })}
            placeholder="••••••••"
            required
            aria-invalid={!!fieldErrors.password_confirmation}
            aria-describedby={fieldErrors.password_confirmation ? "confirm-password-error" : undefined}
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
          <p id="confirm-password-error" className="text-red-300 text-xs mt-1.5">
            {fieldErrors.password_confirmation}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
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
          <span className="text-sm text-purple-200">
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
        {termsError && (
          <p className="text-red-300 text-xs ml-7">{termsError}</p>
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
            Creating Store...
          </span>
        ) : (
          "Create Store"
        )}
      </button>

      {/* Already have an account */}
      <p className="text-center text-sm text-purple-200 pt-2">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
