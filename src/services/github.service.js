// src/services/github.service.js
// 通过 GitHub Gist 同步工作区数据，实现跨设备“不丢信息”
import { useSyncStore } from '../stores/sync.slice';
import { exportWorkspace, STORE_KEYS } from './storage.service';

const API = 'https://api.github.com/gists';
const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// 推送到 Gist：已存在则更新，否则创建（创建后记录 gistId）
export const pushToGist = async () => {
  const { gistToken, gistId, gistFilename } = useSyncStore.getState();
  if (!gistToken) throw new Error('请先在设置中填写 GitHub Token');
  const content = exportWorkspace();
  const body = JSON.stringify({
    description: 'agentic-workspace 同步数据',
    files: { [gistFilename]: { content } },
  });
  if (gistId) {
    const res = await fetch(`${API}/${gistId}`, { method: 'PATCH', headers: headers(gistToken), body });
    if (!res.ok) throw new Error(`Gist 更新失败 (${res.status})`);
    return gistId;
  }
  const res = await fetch(API, { method: 'POST', headers: headers(gistToken), body });
  if (!res.ok) throw new Error(`Gist 创建失败 (${res.status})`);
  const json = await res.json();
  useSyncStore.getState().setGistConfig({ gistId: json.id });
  return json.id;
};

// 从 Gist 拉取并还原到本地
export const pullFromGist = async () => {
  const { gistToken, gistId, gistFilename } = useSyncStore.getState();
  if (!gistToken || !gistId) throw new Error('请先同步一次以创建 Gist');
  const res = await fetch(`${API}/${gistId}`, { headers: headers(gistToken) });
  if (!res.ok) throw new Error(`Gist 拉取失败 (${res.status})`);
  const json = await res.json();
  const file = json.files[gistFilename];
  if (!file) throw new Error('Gist 中未找到数据文件');
  const parsed = JSON.parse(file.content);
  const stores = parsed.stores || parsed;
  Object.entries(stores).forEach(([k, v]) => {
    if (STORE_KEYS.includes(k)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  });
  window.location.reload();
};
