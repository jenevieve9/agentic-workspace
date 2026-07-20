// src/components/Button.jsx
// 按钮：清爽的实色按钮
export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-sm px-4 py-1.5 rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
