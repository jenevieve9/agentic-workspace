// src/components/Tag.jsx
// 标签：清爽的次级胶囊
export default function Tag({ children, className = '', onClick }) {
  const interaction = onClick ? 'cursor-pointer hover:border-[var(--accent)]' : '';
  return (
    <span
      onClick={onClick}
      className={`text-xs px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-border text-text-secondary ${interaction} ${className}`}
    >
      {children}
    </span>
  );
}
