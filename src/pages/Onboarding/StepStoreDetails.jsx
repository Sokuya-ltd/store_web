import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function StepStoreDetails({ data, updateData }) {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!data.storeName) {
      alert("Please enter your store name");
      return;
    }
    navigate("/onboarding/bank");
  };

  const handleBack = () => {
    navigate("/onboarding");
  };

  return (
    <form className="space-y-4" onSubmit={handleNext}>
      <Input
        label="Store Name"
        type="text"
        value={data.storeName}
        onChange={(e) => updateData({ storeName: e.target.value })}
        required
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Store Category
        </label>
        <select
          value={data.storeCategory}
          onChange={(e) => updateData({ storeCategory: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70"
        >
          <option value="">Select a category</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
