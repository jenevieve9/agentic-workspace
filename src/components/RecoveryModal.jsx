// src/components/RecoveryModal.jsx
// 页面加载时检测本地是否为空：若用户换设备或清除数据，提示从 Gist 恢复或导入备份
import { useEffect, useRef, useState } from 'react';
import { STORE_KEYS } from '../services/storage.service';
import { useSyncStore } from '../stores/sync.slice';
import { pullFromGist } from '../services/github.service';
import { importWorkspace } from '../services/storage.service';

export default function RecoveryModal() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);
  const fileRef = useRef(null);

  const { gistToken, gistId, setGistConfig } = useSyncStore();
  const [tokenInput, setTokenInput] = useState(gistToken || '');
  const [idInput, setIdInput] = useState(gistId || '');

  useEffect(() => {
    // 只要任意一个 store key 在 localStorage 中有值，就视为“不是空设备”
    const hasData = STORE_KEYS.some((k) => localStorage.getItem(k));
    if (!hasData) setOpen(true);
  }, []);

  useEffect(() => {
    setTokenInput(gistToken || '');
    setIdInput(gistId || '');
  }, [gistToken, gistId]);

  const handleRestore = async () => {
    setError(null);
    setOk(null);
    if (!tokenInput.trim()) {
      setError('请填写 GitHub Token（需含 gist 权限）');
      return;
    }
    if (!idInput.trim()) {
      setError('请填写 Gist ID，或先前往「系统联动」执行一次“同步到 Gist”以创建 Gist');
      return;
    }
    setBusy(true);
    try {
      // 先保存到 sync store，让 pullFromGist 能读到
      setGistConfig({ gistToken: tokenInput.trim(), gistId: idInput.trim() });
      await new Promise((r) => setTimeout(r, 50)); // 等 zustand persist 写盘
      await pullFromGist();
      setOk('已从 Gist 恢复，页面即将刷新…');
    } catch (e) {
      setError(e.message || '恢复失败');
    } finally {
      setBusy(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importWorkspace(reader.result);
        setOk('备份已导入，页面即将刷新…');
      } catch {
        setError('文件解析失败：不是有效的工作区备份');
      }
    };
    reader.readAsText(file);
  };

  const startFresh = () => setOpen(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-md shadow-lg p-6">
        <div className="font-medium text-base mb-2">检测到本地数据为空</div>
        <p className="text-sm text-text-secondary mb-5">
          换电脑或清除浏览器数据后，可以从 GitHub Gist 恢复，也可以导入之前导出的备份。
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-sm text-sm border border-red-300 text-red-600 bg-red-50/40">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-4 px-3 py-2 rounded-sm text-sm border border-green-300 text-green-700 bg-green-50/40">
            {ok}
          </div>
        )}

        <div className="space-y-3 mb-5">
          <label className="block text-sm">
            <span className="text-xs text-text-light">GitHub Token（需含 gist 权限）</span>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="mt-1 w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-text-light">Gist ID（可在 Gist URL 末尾复制）</span>
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="mt-1 w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={handleRestore}
            className="px-4 py-1.5 bg-[var(--accent)] text-white text-sm rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            {busy ? '恢复中…' : '从 Gist 恢复'}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)]"
          >
            导入备份
          </button>
          <button
            onClick={startFresh}
            className="px-4 py-1.5 border border-border rounded-sm text-sm hover:bg-[var(--surface-2)]"
          >
            开始全新使用
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        <p className="mt-5 text-xs text-text-light leading-relaxed">
          提示：如果没有配置过 Gist，请先在原设备「系统联动」里填写 Token 并点击“同步到 Gist”，生成并绑定 Gist 后，再到新设备填写同样的 Token 和 Gist ID 进行恢复。
        </p>
      </div>
    </div>
  );
}
