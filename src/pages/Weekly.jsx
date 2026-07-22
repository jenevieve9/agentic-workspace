// src/pages/Weekly.jsx
// 周计划：本周重点编辑 + 实时筛选所有 TODO（按 weekId）+ Obsidian 同步
import { useState, useCallback } from 'react';
import PageTitle from '../components/PageTitle';
import { useWeeklyStore } from '../stores/weekly.slice';
import { useTodosStore, getWeekId } from '../stores/todos.slice';
import { useObsidianStore } from '../stores/obsidian.slice';

// 计算某天的周一（weekOffset: 0=本周, -1=上周, 1=下周）
const getMonday = (date, offset = 0) => {
  const d = new Date(date);
  const dow = d.getDay() || 7;
  d.setDate(d.getDate() - dow + 1 + offset * 7);
  return d;
};

const formatMD = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// 生成该周的所有日期 (Mon-Sun)
const weekDates = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return formatDate(d);
  });

export default function Weekly() {
  const { weeklyPlans, setWeeklySummary } = useWeeklyStore();
  const { todos, toggleTodo } = useTodosStore();
  const { vault } = useObsidianStore();

  const [offset, setOffset] = useState(0);
  const monday = getMonday(new Date(), offset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekId = getWeekId(formatDate(monday));
  const dates = weekDates(monday);
  const summary = weeklyPlans[weekId]?.summary || '';

  // 筛选本周所有 TODO
  const weekTasks = dates.flatMap((date) =>
    (todos[date] || []).map((t) => ({
      ...t,
      sourceDate: date,
    }))
  );

  const total = weekTasks.length;
  const done = weekTasks.filter((t) => t.done).length;

  // 本周重点实时保存
  const handleSummaryChange = useCallback(
    (e) => setWeeklySummary(weekId, e.target.value),
    [weekId, setWeeklySummary]
  );

  // ====== 同步到 Obsidian ======
  const syncToObsidian = () => {
    const lines = [];
    dates.forEach((date, i) => {
      const dayTasks = todos[date] || [];
      if (dayTasks.length === 0) return;
      const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      lines.push(`### ${labels[i]}（${formatMD(new Date(date))}）`);
      dayTasks.forEach((t) => {
        const check = t.done ? 'x' : ' ';
        lines.push(`- [${check}] ${t.content}`);
      });
      lines.push('');
    });

    const markdown =
      `# 周计划 · ${weekId}（${formatMD(monday)} – ${formatMD(sunday)}）\n\n` +
      `## 本周重点\n${summary || '[在此填写本周重点]'}\n\n` +
      `## 本周任务\n\n` +
      lines.join('\n') +
      `---\n完成度：${done}/${total}`;

    const encoded = encodeURIComponent(markdown);
    const path = encodeURIComponent(`02_Reflections/周计划/周计划_${weekId}`);
    window.open(
      `obsidian://new?vault=${encodeURIComponent(vault)}&file=${path}&content=${encoded}&overwrite=true`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6">
      {/* 头部：周导航 + Obsidian 同步 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="px-2 py-1 text-xs border border-border rounded-sm hover:bg-[var(--surface-2)]"
          >
            ← 上一周
          </button>
          <PageTitle
            pageKey="weekly"
            subtitle={`第${weekId.split('-W')[1]}周（${formatMD(monday)} – ${formatMD(sunday)}）`}
          />
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="px-2 py-1 text-xs border border-border rounded-sm hover:bg-[var(--surface-2)]"
          >
            下一周 →
          </button>
        </div>
        <button
          onClick={syncToObsidian}
          className="px-4 py-1.5 border border-border rounded-sm text-sm bg-white hover:bg-black hover:text-white transition shrink-0"
        >
          同步到 Obsidian
        </button>
      </div>

      {/* 本周重点 */}
      <div className="bg-surface border border-border rounded-md p-4">
        <div className="text-xs font-mono text-text-light mb-2">本周重点</div>
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          placeholder="写下本周最重要的 1-3 个目标..."
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-sm text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* 本周任务 + 进度 */}
      <div className="bg-surface border border-border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono text-text-light">
            本周任务 · {weekId.split('-W')[1]}
          </div>
          <div className="text-xs font-mono text-text-secondary">
            已完成 {done}/{total}
          </div>
        </div>

        {/* 进度条 */}
        {total > 0 && (
          <div className="h-1 w-full bg-[var(--surface-2)] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%` }}
            />
          </div>
        )}

        {weekTasks.length === 0 ? (
          <div className="text-text-light text-sm text-center py-6">
            本周暂无任务，去「今日 TODO」页面添加
          </div>
        ) : (
          <div className="space-y-1">
            {weekTasks.map((t) => (
              <div key={`${t.sourceDate}-${t.id}`} className="flex items-center gap-3 py-1.5 border-b border-border/40 group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-black flex-shrink-0"
                  checked={t.done}
                  onChange={() => toggleTodo(t.sourceDate, t.id)}
                />
                <span className={`text-sm flex-1 ${t.done ? 'text-text-light line-through' : ''}`}>
                  {t.content}
                </span>
                <span className="text-xs text-text-light flex-shrink-0 opacity-40 group-hover:opacity-100">
                  {formatMD(new Date(t.sourceDate))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
