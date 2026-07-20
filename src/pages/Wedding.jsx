// src/pages/Wedding.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Editable from '../components/Editable';
import { useWeddingStore } from '../stores/wedding.slice';
import { useFitnessStore } from '../stores/fitness.slice';

const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function Wedding() {
  const { tasks, addTask, toggleTask, updateTask, removeTask } = useWeddingStore();
  const { diet } = useFitnessStore();
  const [newTask, setNewTask] = useState('');

  const handleAdd = () => {
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle
        pageKey="wedding"
        subtitle="每周实操 + 饮食 · 与减肥修身联动"
        right={
          <Link to="/fitness" className="px-4 py-1.5 border border-[var(--accent)] rounded-sm text-sm hover:bg-black hover:text-white transition">
            联动减肥
          </Link>
        }
      />

      {/* 每周实操任务 */}
      <section>
        <h2 className="text-sm font-mono text-text-secondary tracking-wide mb-3">每周实操</h2>
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="输入本周筹备任务..."
              className="flex-1 px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd} className="px-4 py-1.5 bg-black text-white text-sm rounded-sm">添加</button>
          </div>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 text-sm border-b border-border/50 pb-2">
                <input type="checkbox" className="w-4 h-4 accent-black" checked={t.done} onChange={() => toggleTask(t.id)} />
                <Editable
                  as="span"
                  value={t.title}
                  onCommit={(v) => updateTask(t.id, v)}
                  className={`flex-1 outline-none focus:ring-1 focus:ring-black rounded px-1 ${t.done ? 'text-text-secondary line-through' : 'text-text-main'}`}
                />
                <button className="ml-auto text-text-light hover:text-[var(--accent)] text-xs" onClick={() => removeTask(t.id)}>删除</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 每周饮食（与减肥修身同源） */}
      <section>
        <h2 className="text-sm font-mono text-text-secondary tracking-wide mb-3">每周饮食方案</h2>
        <div className="border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-2)] text-text-secondary text-xs font-mono">
                <tr>
                  <th className="p-3 text-left w-16">日</th>
                  <th className="p-3 text-left">早餐</th>
                  <th className="p-3 text-left">午餐</th>
                  <th className="p-3 text-left">晚餐</th>
                </tr>
              </thead>
              <tbody>
                {WEEK_DAYS.map((day) => (
                  <tr key={day} className="border-t border-border">
                    <td className="p-3 font-mono text-text-light text-xs">{day}</td>
                    <td className="p-3 text-text-secondary">{diet.breakfast?.[day] || ''}</td>
                    <td className="p-3 text-text-secondary">{diet.lunch?.[day] || ''}</td>
                    <td className="p-3 text-text-secondary">{diet.dinner?.[day] || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-text-light mt-2">饮食内容与「减肥修身」同步，可在该页编辑。</p>
      </section>
    </div>
  );
}
