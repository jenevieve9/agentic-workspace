// src/services/storage.service.js
// 将全部本地 store 打包 / 还原，实现跨设备“不丢信息”
export const STORE_KEYS = [
  'ui-storage',
  'goals-storage',
  'monthly-storage',
  'todos-storage',
  'content-storage',
  'diary-storage',
  'thoughts-storage',
  'wedding-storage',
  'weekly-storage',
  'fitness-storage',
  'obsidian-storage',
  'sync-storage',
];

// 导出全部 store 为 JSON 字符串
export const exportWorkspace = () => {
  const stores = {};
  STORE_KEYS.forEach((k) => {
    const v = localStorage.getItem(k);
    if (v) stores[k] = v;
  });
  return JSON.stringify(
    { app: 'agentic-workspace', version: 1, exportedAt: new Date().toISOString(), stores },
    null,
    2
  );
};

// 触发浏览器下载备份文件
export const downloadWorkspace = () => {
  const blob = new Blob([exportWorkspace()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agentic-workspace-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// 从 JSON 字符串还原全部 store，并刷新页面使其重新水合
export const importWorkspace = (jsonString) => {
  const parsed = JSON.parse(jsonString);
  const stores = parsed.stores || parsed;
  Object.entries(stores).forEach(([k, v]) => {
    if (STORE_KEYS.includes(k)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  });
  window.location.reload();
};

// 清空全部本地数据（保留代码本身）
export const resetWorkspace = () => {
  STORE_KEYS.forEach((k) => localStorage.removeItem(k));
  window.location.reload();
};
