// src/pages/Weekly.jsx
import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Editable from '../components/Editable';
import { useWeeklyStore, WEEK_DAYS } from '../stores/weekly.slice';

export default function Weekly() {
  const { plan, addTask, toggleTask, updateTask, removeTask } = useWeeklyStore();
  const [draft, setDraft] = useState({});

  const handleAdd = (day) => {
    const text = (draft[day] || '').trim();
    if (text) {
      addTask(day, text);
      setDraft((d) => ({ ...d, [day]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle pageKey="weekly" subtitle="第30周 (7.20 – 7.26)" />

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
