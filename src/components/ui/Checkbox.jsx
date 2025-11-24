export default function Checkbox({ label, checked, onChange, id, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 accent-black border-gray-300 rounded focus:ring-black"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    </div>
  );
}
