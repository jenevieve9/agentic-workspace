// src/pages/Thoughts.jsx
// 思考积累：9 大分类、筛选、增删改、生成内容（跳转内容工坊）、同步 Obsidian
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Editable from '../components/Editable';
import { useThoughtsStore, CATEGORIES } from '../stores/thoughts.slice';
import { useObsidianStore } from '../stores/obsidian.slice';

export default function Thoughts() {
  const { thoughts, addThought, updateThought, removeThought } = useThoughtsStore();
  const { vault } = useObsidianStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('全部');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (content.trim()) {
      addThought(category, content.trim());
      setContent('');
    }
  };

  const generateContent = (t) => {
    navigate('/content-studio', { state: { topic: t.content } });
  };

  // 将一条思考同步为 Obsidian 笔记（URL Scheme）
  const syncToObsidian = (thought) => {
    const title = `思考_${thought.date}`;
    const text = `# 思考记录\n\n**分类**: ${thought.category}\n**日期**: ${thought.date}\n\n${thought.content}`;
    const encoded = encodeURIComponent(text);
    window.open(
      `obsidian://new?vault=${encodeURIComponent(vault)}&name=${encodeURIComponent(title)}&content=${encoded}`,
      '_blank'
    );
  };

  const shown = filter === '全部' ? thoughts : thoughts.filter((t) => t.category === filter);

  return (
    <div className="space-y-6">
      <PageTitle pageKey="thoughts" subtitle="输入 · 分类 · 联动 Obsidian" />

      {/* 捕获表单 */}
      <div className="bg-surface border border-border rounded-md p-4 flex flex-col sm:flex-row gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 border border-border rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="记录一个想法..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button onClick={handleAdd} className="px-4 py-1.5 bg-black text-white text-sm rounded-sm whitespace-nowrap">
          + 捕获
        </button>
      </div>

      {/* 分类筛选（9 个 + 全部） */}
      <div className="flex flex-wrap gap-2">
        {['全部', ...CATEGORIES].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-1 text-xs border rounded-full transition ${
              filter === tag ? 'border-[var(--accent)] bg-black text-white' : 'border-border text-text-secondary hover:border-[var(--accent)]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.length === 0 ? (
          <div className="text-text-light text-sm text-center py-8">该分类下还没有思考</div>
        ) : (
          shown.map((t) => (
            <div key={t.id} className="bg-surface border border-border rounded-md p-4 group">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-light bg-[var(--surface-2)] px-2 py-0.5 rounded-sm">{t.category}</span>
                <span className="text-xs text-text-light">{t.date}</span>
                <button
                  className="ml-auto text-text-light hover:text-[var(--accent)] text-xs opacity-0 group-hover:opacity-100"
                  onClick={() => removeThought(t.id)}
                >
                  删除
                </button>
              </div>
              <Editable
                as="div"
                value={t.content}
                onCommit={(v) => updateThought(t.id, { content: v })}
                className="text-sm mt-1 outline-none focus:ring-1 focus:ring-black rounded px-1"
              />
              <div className="mt-2 flex gap-3 text-xs text-text-light">
                <button className="hover:text-[var(--accent)]" onClick={() => generateContent(t)}>→ 生成内容</button>
                <button className="hover:text-[var(--accent)]" onClick={() => syncToObsidian(t)}>同步 Obsidian</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
