// src/components/Progress.jsx
// 进度条：清爽的填充条
export default function Progress({ value = 0, className = '' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-1.5 w-full rounded-full bg-[var(--surface-2)] overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
