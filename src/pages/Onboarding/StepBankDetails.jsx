import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function StepBankDetails({ data, updateData }) {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/onboarding/finish");
  };

  const handleBack = () => {
    navigate("/onboarding/store");
  };

  return (
    <form className="space-y-4" onSubmit={handleNext}>
      <Input
        label="Bank Name"
        type="text"
        value={data.bankName}
        onChange={(e) => updateData({ bankName: e.target.value })}
      />

      <Input
        label="Account Number"
        type="text"
        value={data.accountNumber}
        onChange={(e) => updateData({ accountNumber: e.target.value })}
      />

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
