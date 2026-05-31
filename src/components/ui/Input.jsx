export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-200">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all ${
          error ? "border-red-400 focus:ring-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-300">{error}</p>
      )}
    </div>
  );
}
