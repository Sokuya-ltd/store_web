import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";

export default function StepBusinessInfo({ data, updateData }) {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    // basic validation
    if (!data.name || !data.email || !data.password || !data.phone) {
      alert("Please fill in all required fields");
      return;
    }
    if (data.password !== data.password_confirmation) {
      alert("Passwords do not match");
      return;
    }
    navigate("/onboarding/store");
  };

  return (
    <form className="space-y-4" onSubmit={handleNext}>
      <Input
        label="Full Name"
        type="text"
        value={data.name}
        onChange={(e) => updateData({ name: e.target.value })}
        required
      />

      <Input
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => updateData({ email: e.target.value })}
        required
      />

      <Input
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={(e) => updateData({ phone: e.target.value })}
        required
      />

      <Input
        label="Store Name"
        type="text"
        value={data.store_name}
        onChange={(e) => updateData({ store_name: e.target.value })}
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
          value={data.business_registration_number}
          onChange={(e) => updateData({ business_registration_number: e.target.value })}
          placeholder="e.g., 12345678"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Commission Rate (%)"
          type="number"
          step="0.1"
          value={data.commission_rate}
          onChange={(e) => updateData({ commission_rate: parseFloat(e.target.value) || 0 })}
        />

        <Input
          label="Minimum Order Amount (£)"
          type="number"
          step="0.01"
          value={data.minimum_order_amount}
          onChange={(e) => updateData({ minimum_order_amount: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Store Description (optional)
        </label>
        <Textarea
          rows={3}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          value={data.password}
          onChange={(e) => updateData({ password: e.target.value })}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => updateData({ password_confirmation: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-6 py-2">Create Store</Button>
      </div>
    </form >
  );
}
