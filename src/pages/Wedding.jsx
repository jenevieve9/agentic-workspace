// src/pages/Wedding.jsx
export default function Wedding() {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* 头部：标题 + 跳转按钮 */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
        <h1 className="text-2xl font-light tracking-wide">备婚</h1>
        <a
          href="https://jenevieve9.github.io/my-wedding/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary hover:text-text-main underline-offset-2 hover:underline transition"
        >
          在新窗口打开 ↗
        </a>
      </div>
      {/* iframe 嵌入完整备婚页面 */}
      <iframe
        src="https://jenevieve9.github.io/my-wedding/"
        className="w-full flex-1 rounded-lg border border-border/60 bg-white"
        title="备婚看板"
        loading="lazy"
      />
    </div>
  );
}
