// src/components/PageTitle.jsx
// 可点击编辑的页面标题，失焦自动保存（持久化到 ui.slice）
import { useUiStore } from '../stores/ui.slice';

export default function PageTitle({ pageKey, subtitle, right }) {
  const title = useUiStore((s) => s.titles[pageKey] ?? pageKey);
  const setPageTitle = useUiStore((s) => s.setPageTitle);

  return (
    <div className="flex justify-between items-end border-b border-border pb-4 mb-2">
      <div>
        <h1
          className="outline-none focus:ring-1 focus:ring-[var(--accent)] rounded px-1 leading-tight text-[var(--heading-size)] font-semibold tracking-tight"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setPageTitle(pageKey, e.currentTarget.innerText.trim())}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-xs mt-1.5">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
