// src/pages/Settings.jsx
// 系统联动：跨设备数据同步（导出/导入/Gist）+ Obsidian 联动配置
import { useState, useRef, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { useSyncStore } from '../stores/sync.slice';
import { useObsidianStore } from '../stores/obsidian.slice';
import {
  downloadWorkspace,
  importWorkspace,
  resetWorkspace,
} from '../services/storage.service';
import { pushToGist, pullFromGist } from '../services/github.service';
import {
  writeTodayDiary,
  testObsidianRest,
} from '../services/obsidian.service';

export default function Settings() {
  const { gistToken, gistId, setGistConfig } = useSyncStore();
  const {
    vault,
    restEnabled,
    apiKey,
    setObsidianConfig,
  } = useObsidianStore();

  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const note = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };
  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      note('err', e.message || '操作失败');
    } finally {
      setBusy(false);
    }
  };

  // 若环境变量配置了 VITE_GITHUB_TOKEN，且用户尚未手动填写，则自动填入
  useEffect(() => {
    const envToken = import.meta.env.VITE_GITHUB_TOKEN;
    if (envToken && !gistToken) setGistConfig({ gistToken: envToken });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importWorkspace(reader.result);
      } catch (err) {
        note('err', '文件解析失败：不是有效的工作区备份');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageTitle pageKey="settings" subtitle="跨设备同步 · Obsidian · GitHub" />

      {msg && (
        <div
          className={`mb-5 px-4 py-2 rounded-sm text-sm border ${
            msg.type === 'ok'
              ? 'border-green-300 text-green-700 bg-green-50/40'
              : 'border-red-300 text-red-600 bg-red-50/40'
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ===== 数据管理：跨设备不丢信息 ===== */}
        <section className="bg-surface border border-border rounded-md p-5">
          <div className="font-medium text-sm mb-1">数据管理</div>
          <p className="text-xs text-text-light mb-4">
            本地数据存于浏览器。换设备时：导出备份 → 新设备导入；或启用下方 GitHub 同步自动带走。
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                downloadWorkspace();
                note('ok', '已导出工作区备份 JSON');
              }}
              className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)]"
            >
              导出备份
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)]"
            >
              导入备份
            </button>
            <button
              onClick={() => {
                if (confirm('确定清空全部本地数据？此操作不可撤销。')) resetWorkspace();
              }}
              className="px-4 py-1.5 border border-red-300 text-red-500 rounded-sm text-sm hover:bg-red-50"
            >
              重置全部
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={onImportFile}
            />
          </div>
        </section>

        {/* ===== GitHub 同步（Gist）===== */}
        <section className="bg-surface border border-border rounded-md p-5">
          <div className="font-medium text-sm mb-1">GitHub 同步</div>
          <p className="text-xs text-text-light mb-4">
            用 GitHub Gist 托管数据。Token 需勾选 gist 权限；数据只存于你的私有 Gist。
          </p>
          <input
            type="password"
            placeholder="GitHub Token（含 gist 权限）"
            value={gistToken}
            onChange={(e) => setGistConfig({ gistToken: e.target.value })}
            className="w-full px-3 py-1.5 border border-border rounded-sm text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <div className="flex flex-wrap gap-2">
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const id = await pushToGist();
                  note('ok', `已同步到 Gist（${id.slice(0, 8)}…）`);
                })
              }
              className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg-solid)] text-sm rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              同步到 Gist
            </button>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await pullFromGist();
                  note('ok', '已从 Gist 拉取并还原');
                })
              }
              className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)] disabled:opacity-50"
            >
              从 Gist 拉取
            </button>
          </div>
          <p className="text-xs text-text-light mt-3">
            状态：{gistId ? `已绑定 Gist ${gistId.slice(0, 8)}…` : '未绑定（首次同步将自动创建）'}
          </p>
        </section>

        {/* ===== Obsidian 联动 ===== */}
        <section className="bg-surface border border-border rounded-md p-5 md:col-span-2">
          <div className="font-medium text-sm mb-1">Obsidian 联动</div>
          <p className="text-xs text-text-light mb-4">
            方式一：URL Scheme（无需插件，点击直接唤起 Obsidian 新建/打开笔记）。方式二：Local REST API（需在 Obsidian 安装插件并填 Key，可静默写入）。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <label className="text-sm">
              <span className="block text-xs text-text-light mb-1">仓库名</span>
              <input
                value={vault}
                onChange={(e) => setObsidianConfig({ vault: e.target.value })}
                className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="block text-xs text-text-light mb-1">
                Local REST API Key（可选，启用后静默写入）
              </span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setObsidianConfig({ apiKey: e.target.value })}
                placeholder="obsidian-local-rest-api 插件生成的 Bearer Token"
                className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`${import.meta.env.BASE_URL}obsidian-vault-template.zip`}
              download
              className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)]"
            >
              下载 Obsidian 模板库
            </a>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={restEnabled}
                onChange={(e) => setObsidianConfig({ restEnabled: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              启用 Local REST API（静默写入，不走弹窗）
            </label>
            <button
              onClick={() =>
                run(async () => {
                  await writeTodayDiary();
                  note('ok', '已唤起 / 写入今日日记');
                })
              }
              className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg-solid)] text-sm rounded-sm hover:opacity-90"
            >
              在 Obsidian 打开今日日记
            </button>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const ok = await testObsidianRest();
                  note(ok ? 'ok' : 'err', ok ? 'REST API 连接成功' : 'REST API 连接失败');
                })
              }
              className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)] disabled:opacity-50"
            >
              测试 REST 连接
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
