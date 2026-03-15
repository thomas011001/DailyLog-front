const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  muted: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  outline:
    "border border-border text-foreground hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-white hover:opacity-90",
};

export function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
