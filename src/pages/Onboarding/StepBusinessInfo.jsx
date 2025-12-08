import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

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
      alert("Please fill in all required fields");
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* General error message display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        value={data.name || ""}
        onChange={(e) => updateData({ name: e.target.value })}
        error={fieldErrors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        value={data.email || ""}
        onChange={(e) => updateData({ email: e.target.value })}
        error={fieldErrors.email}
        required
      />

      <Input
        label="Phone"
        type="tel"
        value={data.phone || ""}
        onChange={(e) => updateData({ phone: e.target.value })}
        error={fieldErrors.phone}
        required
      />

      <Input
        label="Store Name"
        type="text"
        value={data.store_name || ""}
        onChange={(e) => updateData({ store_name: e.target.value })}
        error={fieldErrors.store_name}
        required
      />

      <div className="space-y-1">
        <label className="flex items-center gap-1 text-sm font-medium text-slate-700">
          Registration Number
          <div className="relative group">
            <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Companies House Registration Number
            </div>
          </div>
        </label>
        <Input
          type="text"
          value={data.business_registration_number || ""}
          onChange={(e) => updateData({ business_registration_number: e.target.value })}
          error={fieldErrors.business_registration_number}
          placeholder="e.g., 12345678"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Commission Rate (%)"
          type="number"
          step="0.1"
          value={data.commission_rate ?? ""}
          onChange={(e) => updateData({ commission_rate: parseFloat(e.target.value) || 0 })}
          error={fieldErrors.commission_rate}
        />

        <Input
          label="Minimum Order Amount (£)"
          type="number"
          step="0.01"
          value={data.minimum_order_amount ?? ""}
          onChange={(e) => updateData({ minimum_order_amount: parseFloat(e.target.value) || 0 })}
          error={fieldErrors.minimum_order_amount}
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={data.password || ""}
          onChange={(e) => updateData({ password: e.target.value })}
          error={fieldErrors.password}
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

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={data.password_confirmation || ""}
          onChange={(e) => updateData({ password_confirmation: e.target.value })}
          error={fieldErrors.password_confirmation}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-slate-500 hover:text-slate-700"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
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

      {/* Terms and Conditions */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (e.target.checked) setTermsError("");
            }}
            className="mt-1 w-4 h-4 text-[#D35400] border-slate-300 rounded focus:ring-[#D35400]"
          />
          <span className="text-sm text-slate-600">
            I agree to the{" "}
            <Link to="/terms" className="text-[#D35400] hover:underline font-medium">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#D35400] hover:underline font-medium">
              Privacy Policy
            </Link>
          </span>
        </label>
        {termsError && (
          <p className="text-xs text-red-600 ml-7">{termsError}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          className="bg-[#000000] hover:bg-[#333333] text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating Store...
            </span>
          ) : (
            "Create Store"
          )}
        </Button>
      </div>

      {/* Already have an account */}
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#D35400] hover:text-[#B84700] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form >
  );
}
