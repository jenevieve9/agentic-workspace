// src/pages/Wedding.jsx
// 备婚页：iframe 直接嵌入 my-wedding 完整站点 + 新窗口跳转按钮。
// 风格：Notion 极简——干净留白、浅灰分割线、字重区分层级。
export default function Wedding() {
  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      {/* 头部：标题 + 跳转按钮 */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-2xl font-light tracking-wide text-text-main">备婚</h1>
        <a
          href="https://jenevieve9.github.io/my-wedding/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-secondary underline-offset-2 transition hover:text-text-main hover:underline"
        >
          在新窗口打开 ↗
        </a>
      </div>

      {/* iframe 嵌入完整备婚页面 */}
      <iframe
        src="https://jenevieve9.github.io/my-wedding/"
        className="w-full flex-1 rounded-lg border border-border bg-white"
        title="备婚看板"
        loading="lazy"
      />
    </div>
  );
}
