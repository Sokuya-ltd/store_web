import { useState, useEffect } from "react";
import { DollarSign, Lock, CreditCard, PoundSterlingIcon, Eye, EyeOff } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { colors } from "../../lib/colors";

export default function FinanceInformationForm({ initialData = {} }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingSection, setLoadingSection] = useState(null); // "business" or "bank"
  const [showBankAccountNumber, setShowBankAccountNumber] = useState(false);
  const [form, setForm] = useState({
    // Business Information
    business_registration_number: initialData.business_registration_number || "",
    tax_id: initialData.tax_id || "",

    // Bank Information
    bank_account_number: initialData.bank_account_number || "",
    bank_name: initialData.bank_name || "",
    bank_routing_number: initialData.bank_routing_number || "",
    bank_account_holder: initialData.bank_account_holder || "",
  });

  // Update form when initialData changes
  useEffect(() => {
    setForm({
      business_registration_number: initialData.business_registration_number || "",
      tax_id: initialData.tax_id || "",
      bank_account_number: initialData.bank_account_number || "",
      bank_name: initialData.bank_name || "",
      bank_routing_number: initialData.bank_routing_number || "",
      bank_account_holder: initialData.bank_account_holder || "",
    });
  }, [initialData]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/store/profile");
        const profileData = response.store_owner || response.data;
        if (profileData) {
          setForm({
            business_registration_number: profileData.business_registration_number || "",
            tax_id: profileData.tax_id || "",
            bank_account_number: profileData.bank_account_number || "",
            bank_name: profileData.bank_name || "",
            bank_routing_number: profileData.bank_routing_number || "",
            bank_account_holder: profileData.name || "",
          });
        }
      } catch (err) {
        // Error fetching profile silently handled
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBusinessInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingSection("business");
    setErrors((prev) => ({
      ...prev,
      business_registration_number: undefined,
      tax_id: undefined,
    }));

    try {
      const response = await api.post("/store/business-info", {
        business_registration_number: form.business_registration_number,
        tax_id: form.tax_id,
      });
      // Update form with response data if available
      if (response.data) {
        setForm((prev) => ({
          ...prev,
          business_registration_number: response.data.business_registration_number || prev.business_registration_number,
          tax_id: response.data.tax_id || prev.tax_id,
        }));
      }
      toast.success(response.message || "Business information updated successfully!");
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setErrors((prev) => ({
          ...prev,
          ...Object.entries(err.errors).reduce(
            (acc, [field, msgs]) => ({
              ...acc,
              [field]: msgs[0],
            }),
            {}
          ),
        }));
        toast.error(err.message || "Validation failed");
      } else {
        toast.error(err.message || "Failed to update business information");
      }
    } finally {
      setLoadingSection(null);
    }
  };

  const handleBankInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingSection("bank");
    setErrors((prev) => ({
      ...prev,
      bank_name: undefined,
      bank_routing_number: undefined,
      bank_account_number: undefined,
      bank_account_holder: undefined,
    }));

    try {
      const response = await api.post("/store/bank-info", {
        bank_account_number: form.bank_account_number,
        bank_name: form.bank_name,
        bank_routing_number: form.bank_routing_number,
        bank_account_holder: form.bank_account_holder,
      });
      // Update form with response data if available
      if (response.data) {
        setForm((prev) => ({
          ...prev,
          bank_account_number: response.data.bank_account_number || prev.bank_account_number,
          bank_name: response.data.bank_name || prev.bank_name,
          bank_routing_number: response.data.bank_routing_number || prev.bank_routing_number,
          bank_account_holder: response.data.bank_account_holder || prev.bank_account_holder,
        }));
      }
      toast.success(response.message || "Bank information updated successfully!");
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setErrors((prev) => ({
          ...prev,
          ...Object.entries(err.errors).reduce(
            (acc, [field, msgs]) => ({
              ...acc,
              [field]: msgs[0],
            }),
            {}
          ),
        }));
        toast.error(err.message || "Validation failed");
      } else {
        toast.error(err.message || "Failed to update bank information");
      }
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <form className="space-y-6">
      {/* Business Information Card */}
      <Card className="p-4 md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <PoundSterlingIcon className="w-6 h-6 text-slate-700" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Business Information</h3>
            <p className="text-sm text-slate-600">Provide your business registration and tax information for compliance and invoicing.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Business Registration Number
            </label>
            <Input
              name="business_registration_number"
              value={form.business_registration_number}
              onChange={handleChange}
              placeholder="e.g., BR123456"
              error={errors.business_registration_number}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tax ID / VAT Number
            </label>
            <Input
              name="tax_id"
              value={form.tax_id}
              onChange={handleChange}
              placeholder="e.g., VAT123456"
              error={errors.tax_id}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleBusinessInfoSubmit}
            disabled={loadingSection === "business"}
            className="py-2 px-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.accent.olive }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5d29'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent.olive}
          >
            {loadingSection === "business" ? "Saving..." : "Save Business Info"}
          </Button>
        </div>
      </Card>

      {/* Bank Information Card */}
      <Card className="p-4 md:p-6 border-blue-200 bg-linear-to-br from-blue-50 to-transparent">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-700" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Bank Account Details</h3>
            <p className="text-sm text-slate-600">Your bank details are encrypted and stored securely.</p>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Lock className="w-4 h-4 text-blue-600" />
          <p className="text-xs text-blue-900">
            All bank information is encrypted using industry-standard security protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bank Name
            </label>
            <Input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              placeholder="e.g., HSBC, Barclays, Lloyds"
              error={errors.bank_name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Account Holder Name
            </label>
            <Input
              name="bank_account_holder"
              value={form.bank_account_holder}
              onChange={handleChange}
              placeholder="Full name on account"
              error={errors.bank_account_holder}
              readOnly
              className="bg-slate-50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Auto-populated from store owner name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bank Routing Number
            </label>
            <Input
              name="bank_routing_number"
              value={form.bank_routing_number}
              onChange={handleChange}
              placeholder="e.g., 021000021"
              error={errors.bank_routing_number}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bank Account Number
            </label>
            <div className="relative">
              <Input
                name="bank_account_number"
                type={showBankAccountNumber ? "text" : "password"}
                value={form.bank_account_number}
                onChange={handleChange}
                placeholder="Account number (masked for security)"
                error={errors.bank_account_number}
              />
              <button
                type="button"
                onClick={() => setShowBankAccountNumber(!showBankAccountNumber)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {showBankAccountNumber ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Your account number is encrypted and secure</p>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleBankInfoSubmit}
            disabled={loadingSection === "bank"}
            className="py-2 px-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.accent.olive }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5d29'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent.olive}
          >
            {loadingSection === "bank" ? "Saving..." : "Save Bank Details"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
