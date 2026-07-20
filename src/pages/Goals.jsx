// src/pages/Goals.jsx
import { useState } from 'react';
import { useGoalsStore } from '../stores/goals.slice';
import PageTitle from '../components/PageTitle';
import Progress from '../components/Progress';
import Tag from '../components/Tag';
import Button from '../components/Button';

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, toggleSubTask, toggleMilestone } =
    useGoalsStore();
  const [filter, setFilter] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const filteredGoals = goals.filter((g) =>
    filter === '全部' ? true : g.status === filter
  );

  const openModal = (goal = null) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value,
      description: form.description.value,
      status: form.status.value,
      targetDate: form.targetDate.value,
      tags: form.tags.value.split(',').map((s) => s.trim()).filter(Boolean),
      milestones: form.milestones.value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((content) => ({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: content, dueDate: '', done: false })),
      subTasks: form.subTasks.value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((content) => ({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), content, done: false })),
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, data);
    } else {
      addGoal(data);
    }
    closeModal();
  };

  const getProgress = (g) => {
    const subTotal = (g.subTasks || []).length;
    const subDone = (g.subTasks || []).filter((s) => s.done).length;
    const mileTotal = (g.milestones || []).length;
    const mileDone = (g.milestones || []).filter((m) => m.done).length;
    const total = subTotal + mileTotal;
    if (total === 0) return 0;
    return Math.round(((subDone + mileDone) / total) * 100);
  };

  const statusColor = {
    '进行中': 'bg-black text-white',
    '已完成': 'bg-green-500 text-white',
    '暂停': 'bg-gray-300 text-text-secondary',
  };

  return (
    <div>
      {/* 头部 */}
      <PageTitle
        pageKey="goals"
        subtitle="2026 · 里程碑 + 子任务跟踪"
        right={
          <Button onClick={() => openModal()}>+ 新建</Button>
        }
      />

      {/* 筛选 */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {['全部', '进行中', '已完成', '暂停'].map((f) => (
          <button
            key={f}
            className={`px-3 py-1 text-xs border border-border rounded-full transition ${
              filter === f ? 'bg-black text-white border-[var(--accent)]' : 'hover:border-[var(--accent)]'
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 目标列表 */}
      <div className="mt-4 space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-text-light text-center py-8">暂无目标</div>
        ) : (
          filteredGoals.map((g) => {
            const progress = getProgress(g);
            return (
              <div key={g.id} className="bg-surface border border-border rounded-md p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-lg font-medium outline-none focus:ring-1 focus:ring-black rounded px-1"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateGoal(g.id, { title: e.target.innerText.trim() })}
                      >
                        {g.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[g.status] || 'bg-gray-200'}`}>
                        {g.status}
                      </span>
                    </div>
                    <div
                      className="text-sm text-text-secondary mt-1 outline-none focus:ring-1 focus:ring-black rounded px-1"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateGoal(g.id, { description: e.target.innerText.trim() })}
                    >
                      {g.description}
                    </div>
                    <div className="text-xs text-text-light font-mono mt-1">
                      目标日期: {g.targetDate || '未设置'}
                    </div>
                    {g.tags && g.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {g.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(g)}
                      className="text-xs text-text-secondary hover:text-[var(--accent)] border border-border px-2 py-1 rounded-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="text-xs text-text-secondary hover:text-red-500 border border-border px-2 py-1 rounded-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-text-light">
                    <span>进度</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                {/* 里程碑 */}
                {g.milestones && g.milestones.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs font-mono text-text-light mb-2">里程碑</div>
                    <div className="space-y-1">
                      {g.milestones.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={m.done}
                            onChange={() => toggleMilestone(g.id, m.id)}
                            className="w-4 h-4 accent-black"
                          />
                          <span
                            className={`outline-none focus:ring-1 focus:ring-black rounded px-1 ${m.done ? 'line-through text-text-light' : ''}`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const updated = g.milestones.map((mm) =>
                                mm.id === m.id ? { ...mm, title: e.target.innerText.trim() } : mm
                              );
                              updateGoal(g.id, { milestones: updated });
                            }}
                          >
                            {m.title}
                          </span>
                          {m.dueDate && (
                            <span className="text-xs text-text-light font-mono">{m.dueDate}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 子任务 */}
                {g.subTasks && g.subTasks.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="text-xs font-mono text-text-light mb-1">子任务</div>
                    <div className="space-y-0.5">
                      {g.subTasks.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={s.done}
                            onChange={() => toggleSubTask(g.id, s.id)}
                            className="w-4 h-4 accent-black"
                          />
                          <span
                            className={`outline-none focus:ring-1 focus:ring-black rounded px-1 ${s.done ? 'line-through text-text-light' : ''}`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const updated = g.subTasks.map((ss) =>
                                ss.id === s.id ? { ...ss, content: e.target.innerText.trim() } : ss
                              );
                              updateGoal(g.id, { subTasks: updated });
                            }}
                          >
                            {s.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingGoal ? '编辑目标' : '新建目标'}
              </h2>
              <button onClick={closeModal} className="text-2xl text-text-light hover:text-[var(--accent)]">
                ×
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-light mb-1">标题 *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingGoal?.title || ''}
                    className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-light mb-1">描述</label>
                  <textarea
                    name="description"
                    rows="2"
                    defaultValue={editingGoal?.description || ''}
                    className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-text-light mb-1">状态</label>
                    <select
                      name="status"
                      defaultValue={editingGoal?.status || '进行中'}
                      className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option>进行中</option>
                      <option>已完成</option>
                      <option>暂停</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-light mb-1">目标日期</label>
                    <input
                      name="targetDate"
                      type="date"
                      defaultValue={editingGoal?.targetDate || ''}
                      className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-light mb-1">标签（逗号分隔）</label>
                  <input
                    name="tags"
                    defaultValue={editingGoal?.tags?.join(', ') || ''}
                    className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="职场, 跳槽, AI"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-light mb-1">里程碑（每行一个）</label>
                  <textarea
                    name="milestones"
                    rows="3"
                    defaultValue={editingGoal?.milestones?.map((m) => m.title).join('\n') || ''}
                    className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="7月完成简历&#10;8月集中面试"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-light mb-1">子任务（每行一个）</label>
                  <textarea
                    name="subTasks"
                    rows="3"
                    defaultValue={editingGoal?.subTasks?.map((s) => s.content).join('\n') || ''}
                    className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="每周投5家简历&#10;整理作品集"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-black text-white text-sm rounded-sm hover:bg-black/80"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
