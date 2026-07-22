// src/pages/Weekly.jsx
// 周计划：按星期组织任务 + 一键同步到 Obsidian
import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Editable from '../components/Editable';
import { useWeeklyStore, WEEK_DAYS } from '../stores/weekly.slice';
import { useObsidianStore } from '../stores/obsidian.slice';

// 计算当前周信息（ISO 周数 + 周一到周日日期）
const getCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 周日 = 7
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const pad = (n) => String(n).padStart(2, '0');
  const formatMD = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

  // ISO 周数
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dDay = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dDay);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return {
    weekNum,
    year: now.getFullYear(),
    monday,
    sunday,
    mondayStr: formatMD(monday),
    sundayStr: formatMD(sunday),
    display: `W${pad(weekNum)}（${formatMD(monday)} – ${formatMD(sunday)}）`,
    dateRange: `${formatMD(monday)} – ${formatMD(sunday)}`,
    filename: `周计划_${now.getFullYear()}-W${pad(weekNum)}`,
  };
};

export default function Weekly() {
  const { plan, addTask, toggleTask, updateTask, removeTask } = useWeeklyStore();
  const { vault } = useObsidianStore();
  const [draft, setDraft] = useState({});

  const week = getCurrentWeek();

  const handleAdd = (day) => {
    const text = (draft[day] || '').trim();
    if (text) {
      addTask(day, text);
      setDraft((d) => ({ ...d, [day]: '' }));
    }
  };

  // 同步到 Obsidian：将本周所有任务格式化为 Markdown，写入仓库根目录
  const syncToObsidian = () => {
    const tasks = WEEK_DAYS.reduce((lines, day) => {
      const dayTasks = plan[day] || [];
      if (dayTasks.length === 0) return lines;
      lines.push(`### ${day}`);
      dayTasks.forEach((t) => {
        const check = t.done ? 'x' : ' ';
        const dateTag = `（${day}新增）`;
        lines.push(`- [${check}] ${t.text} ${dateTag}`);
      });
      lines.push('');
      return lines;
    }, []);

    const total = WEEK_DAYS.reduce((c, d) => c + (plan[d] || []).length, 0);
    const done = WEEK_DAYS.reduce((c, d) => c + (plan[d] || []).filter((t) => t.done).length, 0);
    const pct = total > 0 ? `${done}/${total}` : '0/0';

    const markdown =
      `# 周计划 · ${week.display}\n\n` +
      `## 本周重点\n` +
      `[在此填写本周重点]\n\n` +
      `## 本周任务\n\n` +
      tasks.join('\n') +
      `---\n完成度：${pct}`;

    const encoded = encodeURIComponent(markdown);
    const path = encodeURIComponent(`02_Reflections/周计划/${week.filename}`);
    window.open(
      `obsidian://new?vault=${encodeURIComponent(vault)}&file=${path}&content=${encoded}&overwrite=true`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6">
      <PageTitle
        pageKey="weekly"
        subtitle={`第${week.weekNum}周（${week.mondayStr} – ${week.sundayStr}）`}
        right={
          <button
            onClick={syncToObsidian}
            className="px-4 py-1.5 border border-border rounded-sm text-sm bg-white hover:bg-black hover:text-white transition"
          >
            同步到 Obsidian
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="bg-surface border border-border rounded-md p-3 min-h-[160px] flex flex-col">
            <div className="text-xs font-mono text-text-light mb-2">{day}</div>
            <div className="flex-1 space-y-2">
              {(plan[day] || []).map((t) => (
                <div key={t.id} className="flex items-start gap-2 text-sm group">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-black mt-0.5"
                    checked={t.done}
                    onChange={() => toggleTask(day, t.id)}
                  />
                  <Editable
                    as="span"
                    value={t.text}
                    onCommit={(v) => updateTask(day, t.id, v)}
                    className={`flex-1 outline-none focus:ring-1 focus:ring-black rounded px-1 ${t.done ? 'text-text-light line-through' : ''}`}
                  />
                  <button
                    className="text-text-light hover:text-[var(--accent)] text-xs opacity-0 group-hover:opacity-100"
                    onClick={() => removeTask(day, t.id)}
                  >
                    删
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="添加任务"
              value={draft[day] || ''}
              onChange={(e) => setDraft((d) => ({ ...d, [day]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(day)}
              className="mt-2 w-full px-2 py-1 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
