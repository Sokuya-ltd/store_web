export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  // Check if className has custom background or padding, if so, skip defaults
  const hasCustomBg = className.includes('bg-');
  const hasCustomPadding = className.includes('px-') || className.includes('py-');
  
  const variantClasses = hasCustomBg ? '' : variants[variant];
  const sizeClasses = hasCustomPadding ? '' : sizes[size];

  return (
    <button
      className={`${baseStyles} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
