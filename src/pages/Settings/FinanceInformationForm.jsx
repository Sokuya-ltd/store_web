import { useState } from "react";

export default function FinanceInformationForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    business_registration_number: "",
    tax_id: "",
    bank_account_number: "",
    bank_name: "",
    bank_routing_number: "",
    verification_documents: "",
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Registration #</label>
          <input name="business_registration_number" value={form.business_registration_number} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tax ID</label>
          <input name="tax_id" value={form.tax_id} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Account #</label>
          <input name="bank_account_number" value={form.bank_account_number} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input name="bank_name" value={form.bank_name} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Routing #</label>
          <input name="bank_routing_number" value={form.bank_routing_number} onChange={handleChange} className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Verification Documents (JSON)</label>
          <textarea name="verification_documents" value={form.verification_documents} onChange={handleChange} className="input" />
        </div>
      </div>
      <button type="submit" className="mt-6 w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow">Save Finance Info</button>
    </form>
  );
}
