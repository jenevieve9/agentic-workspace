// src/pages/Diary.jsx
// 日记页：最近 3 篇预览卡片 + Dataview 风格索引表 + Obsidian 深度联动
import PageTitle from '../components/PageTitle';
import { useDiaryStore, diarySummary, sortedDiaries, countWords } from '../stores/diary.slice';
import { useObsidianStore } from '../stores/obsidian.slice';
import { openObsidianByPath, writeTodayDiary } from '../services/obsidian.service';

export default function Diary() {
  const { diaries, deleteDiary } = useDiaryStore();
  const { vault } = useObsidianStore();
  const today = new Date().toISOString().slice(0, 10);
  const all = sortedDiaries(diaries);
  const recent = all.slice(0, 3);

  const writeToday = () => writeTodayDiary();

  // 在 Obsidian 中新建/打开一条日记笔记（URL Scheme）
  const openObsidianNote = (date, content = '') => {
    const title = `日记_${date}`;
    const defaultContent = `# 日记 ${date}\n\n## 今日状态\n-\n\n## 思考\n-`;
    const encoded = encodeURIComponent(content || defaultContent);
    window.open(
      `obsidian://new?vault=${encodeURIComponent(vault)}&name=${encodeURIComponent(title)}&content=${encoded}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-8">
      <PageTitle
        pageKey="diary"
        subtitle="联动 Obsidian · 手帐形式"
        right={
          <button
            onClick={writeToday}
            className="px-5 py-2 bg-black text-white text-sm rounded-sm hover:bg-black/80 transition"
          >
            在 Obsidian 中写日记
          </button>
        }
      />

      {/* 最近 3 篇预览卡片 */}
      <section>
        <div className="text-xs font-mono text-text-light mb-3">最近归档</div>
        {recent.length === 0 ? (
          <div className="text-text-light text-sm border border-border rounded-md p-6 text-center">
            暂无日记，点击右上角在 Obsidian 创建今日日记
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recent.map((d) => (
              <button
                key={d.date}
                onClick={() => openObsidianByPath(d.date)}
                className="text-left bg-surface border border-border rounded-md p-4 hover:border-[var(--accent)] transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-light">{d.date}</span>
                  <span className="text-xs text-text-light group-hover:text-[var(--accent)]">在 Obsidian 打开 →</span>
                </div>
                <p className="text-sm mt-2 leading-relaxed line-clamp-4">
                  {diarySummary(d.content, 60)}
                </p>
                {d.tags && d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {d.tags.map((t) => (
                      <span key={t} className="text-xs bg-[var(--surface-2)] px-2 py-0.5 rounded-sm border border-border text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 完整索引表（Dataview 风格） */}
      <section>
        <div className="font-medium text-sm mb-3">日记索引</div>
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-2)] text-text-secondary text-xs font-mono">
              <tr>
                <th className="p-3 text-left w-32">日期</th>
                <th className="p-3 text-left w-16">字数</th>
                <th className="p-3 text-left">标签</th>
                <th className="p-3 text-right w-40">操作</th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-text-light">暂无日记</td>
                </tr>
              ) : (
                all.map((d) => (
                  <tr key={d.date} className="border-t border-border">
                    <td className="p-3 font-mono text-text-light text-xs">{d.date}</td>
                    <td className="p-3 text-text-secondary text-xs">{countWords(d.content)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(d.tags || []).map((t) => (
                          <span key={t} className="text-xs bg-[var(--surface-2)] px-2 py-0.5 rounded-sm border border-border text-text-secondary">
                            {t}
                          </span>
                        ))}
                        {(d.tags || []).length === 0 && <span className="text-text-light text-xs">—</span>}
                      </div>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        className="text-xs text-text-secondary hover:text-[var(--accent)] mr-3"
                        onClick={() => openObsidianByPath(d.date)}
                      >
                        打开
                      </button>
                      <button
                        className="text-xs text-text-secondary hover:text-[var(--accent)] mr-3"
                        onClick={() => openObsidianNote(d.date, d.content)}
                      >
                        同步
                      </button>
                      <button
                        className="text-xs text-text-light hover:text-red-500"
                        onClick={() => deleteDiary(d.date)}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-light mt-2">
          数据储存在本地，索引与 Obsidian 双向联动：点击「打开」跳转对应笔记，点击「在 Obsidian 中写日记」新建今日日记。
        </p>
      </section>
    </div>
  );
}
