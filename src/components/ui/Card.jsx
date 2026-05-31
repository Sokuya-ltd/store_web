export default function Card({ children, className = "", transparent = false }) {
  const bg = transparent ? "" : "bg-white/7 backdrop-blur-sm";
  return (
    <div className={`${bg} border border-white/10 ${className}`}>
      {children}
    </div>
  );
}
