export default function Badge({ children, variant = "default" }) {
  const base = "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full";
  
  const variants = {
    default: "bg-white/10 text-neutral-300",
    success: "bg-green-400/20 text-green-300",
    warning: "bg-orange-400/20 text-orange-300",
    danger: "bg-red-400/20 text-red-300",
    error: "bg-red-400/20 text-red-300",
    info: "bg-blue-400/20 text-blue-300"
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
