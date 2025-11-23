import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function StepFinish({ data, onSubmit }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    onSubmit();
  };

  const handleBack = () => {
    navigate("/onboarding/bank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
        <p className="text-sm text-slate-500">
          Please review your details before completing the onboarding.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase">
            Business Information
          </div>
          <div className="mt-1 text-sm">
            <div>
              <strong>Name:</strong> {data.businessName || "Not provided"}
            </div>
            <div>
              <strong>Registration:</strong>{" "}
              {data.registrationNumber || "Not provided"}
            </div>
            <div>
              <strong>Address:</strong> {data.address || "Not provided"}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="text-xs font-medium text-slate-500 uppercase">
            Store Details
          </div>
          <div className="mt-1 text-sm">
            <div>
              <strong>Store Name:</strong> {data.storeName || "Not provided"}
            </div>
            <div>
              <strong>Category:</strong>{" "}
              {data.storeCategory || "Not provided"}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="text-xs font-medium text-slate-500 uppercase">
            Bank Details
          </div>
          <div className="mt-1 text-sm">
            <div>
              <strong>Bank Name:</strong> {data.bankName || "Not provided"}
            </div>
            <div>
              <strong>Account Number:</strong>{" "}
              {data.accountNumber || "Not provided"}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between gap-2">
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
