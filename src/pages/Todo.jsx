// src/pages/Todo.jsx
import { useState } from 'react';
import { useTodosStore } from '../stores/todos.slice';
import PageTitle from '../components/PageTitle';

export default function Todo() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodosStore();
  const today = new Date().toISOString().slice(0, 10);
  const list = todos[today] || [];
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      addTodo(today, input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <PageTitle pageKey="todo" subtitle={`今日 · ${today}`} />

      <div className="mt-6 bg-surface border border-border rounded-md p-5">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="输入新任务..."
            className="flex-1 px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 bg-black text-white text-sm rounded-sm hover:bg-black/80"
          >
            添加
          </button>
        </div>
        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="text-text-light text-sm py-4 text-center">今天还没有任务</div>
          ) : (
            list.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 border-b border-border/50 pb-2"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-black"
                  checked={t.done}
                  onChange={() => toggleTodo(today, t.id)}
                />
                <span
                  className={`text-sm flex-1 outline-none focus:ring-1 focus:ring-black rounded px-1 ${
                    t.done ? 'text-text-light line-through' : ''
                  }`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    useTodosStore
                      .getState()
                      .updateTodo &&
                    useTodosStore
                      .getState()
                      .updateTodo(today, t.id, e.target.innerText.trim())
                  }
                >
                  {t.content}
                </span>
                <button
                  className="text-text-light hover:text-[var(--accent)] text-xs"
                  onClick={() => removeTodo(today, t.id)}
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-border text-xs text-text-light flex justify-between">
          <span>共 {list.length} 项 · 未完成 {list.filter((t) => !t.done).length} 项</span>
          <button className="hover:text-[var(--accent)]">归档至 Obsidian</button>
        </div>
      </div>
    </div>
  );
}
