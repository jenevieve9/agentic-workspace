// src/pages/Monthly.jsx
import { useState } from 'react';
import { useMonthlyStore } from '../stores/monthly.slice';
import { useGoalsStore } from '../stores/goals.slice';
import PageTitle from '../components/PageTitle';
import Progress from '../components/Progress';

export default function Monthly() {
  const {
    monthlies,
    addMonthly,
    removeMonthly,
    toggleKeyResult,
    addKeyResult,
    toggleMonthly,
  } = useMonthlyStore();
  const { goals } = useGoalsStore();

  const [title, setTitle] = useState('');
  const [goalId, setGoalId] = useState('');
  const [krText, setKrText] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const goalTitle = (id) => goals.find((g) => g.id === id)?.title || '未关联';

  const handleAdd = () => {
    if (!title.trim()) return;
    const keyResults = krText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    addMonthly({ title: title.trim(), month: currentMonth, goalId: goalId || null, keyResults });
    setTitle('');
    setKrText('');
    setGoalId('');
  };

  const krRate = (m) => {
    const total = m.keyResults.length;
    const done = m.keyResults.filter((k) => k.done).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const list = monthlies.filter((m) => m.month === currentMonth);

  return (
    <div>
      <PageTitle pageKey="monthly" subtitle={`${currentMonth} · 关键结果跟踪`} />

      {/* 新建 */}
      <div className="mt-6 bg-surface border border-border rounded-md p-4 space-y-2">
        <input
          type="text"
          placeholder="月度目标标题，如：网页简历与技能蒸馏"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">关联年度目标（可选）</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="关键结果（每行一个）"
          rows="2"
          value={krText}
          onChange={(e) => setKrText(e.target.value)}
          className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
        >
          + 新增
        </button>
      </div>

      {/* 列表 */}
      <div className="mt-4 space-y-4">
        {list.length === 0 ? (
          <div className="text-text-light text-center py-8">本月暂无目标</div>
        ) : (
          list.map((m) => {
            const progress = krRate(m);
            return (
              <div key={m.id} className="bg-surface border border-border rounded-md p-5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-medium outline-none focus:ring-1 focus:ring-black rounded px-1 ${
                          m.done ? 'line-through text-text-light' : ''
                        }`}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          useMonthlyStore
                            .getState()
                            .updateMonthly(m.id, { title: e.target.innerText.trim() })
                        }
                      >
                        {m.title}
                      </span>
                      {m.goalId && (
                        <span className="text-xs bg-[var(--surface-2)] px-2 py-0.5 rounded-sm border border-border font-mono text-text-light">
                          {goalTitle(m.goalId)}
                        </span>
                      )}
                    </div>

                    {/* 进度条 */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-text-light">
                        <span>关键结果完成度</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* 关键结果 */}
                    <div className="mt-3 space-y-1">
                      {m.keyResults.map((k) => (
                        <div key={k.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={k.done}
                            onChange={() => toggleKeyResult(m.id, k.id)}
                            className="w-4 h-4 accent-black"
                          />
                          <span
                            className={`flex-1 outline-none focus:ring-1 focus:ring-black rounded px-1 ${
                              k.done ? 'line-through text-text-light' : ''
                            }`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              useMonthlyStore
                                .getState()
                                .updateMonthly(m.id, {
                                  keyResults: m.keyResults.map((kk) =>
                                    kk.id === k.id
                                      ? { ...kk, content: e.target.innerText.trim() }
                                      : kk
                                  ),
                                })
                            }
                          >
                            {k.content}
                          </span>
                        </div>
                      ))}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const v = e.target.kr.value.trim();
                          if (v) {
                            addKeyResult(m.id, v);
                            e.target.reset();
                          }
                        }}
                        className="flex gap-2 mt-1"
                      >
                        <input
                          name="kr"
                          placeholder="添加关键结果..."
                          className="flex-1 px-2 py-1 border border-border rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                          type="submit"
                          className="text-xs border border-border px-2 py-1 rounded-sm hover:border-[var(--accent)]"
                        >
                          添加
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleMonthly(m.id)}
                      className="text-xs border border-border px-2 py-1 rounded-sm hover:border-[var(--accent)]"
                    >
                      {m.done ? '已完成' : '标记完成'}
                    </button>
                    <button
                      onClick={() => removeMonthly(m.id)}
                      className="text-xs text-text-light hover:text-red-500"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
