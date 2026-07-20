// src/services/github.service.js
// 通过 GitHub Gist 同步工作区数据，实现跨设备“不丢信息”
import { useSyncStore } from '../stores/sync.slice';
import { exportWorkspace, STORE_KEYS } from './storage.service';

const API = 'https://api.github.com/gists';
const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
});

const readError = async (res) => {
  try {
    const j = await res.json();
    return j?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
};

const gistError = (status, detail) => {
  if (status === 401) {
    return `Gist 鉴权失败（401）：Token 无效、过期或权限不足。请使用 GitHub classic Personal Access Token，并确保勾选 gist 权限。Fine-grained 令牌不支持 Gist API。`;
  }
  if (status === 404) {
    return `Gist 未找到（404）：请检查 Gist ID 是否正确，或该 Token 是否有权访问此 Gist。`;
  }
  if (status === 403) {
    return `Gist 请求被拒绝（403）：可能触发速率限制，或 Token 缺少必要权限。${detail}`;
  }
  if (status === 422) {
    return `Gist 数据格式错误（422）：${detail}`;
  }
  return `Gist 操作失败（${status}）：${detail}`;
};

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
    if (!res.ok) throw new Error(gistError(res.status, await readError(res)));
    return gistId;
  }
  const res = await fetch(API, { method: 'POST', headers: headers(gistToken), body });
  if (!res.ok) throw new Error(gistError(res.status, await readError(res)));
  const json = await res.json();
  useSyncStore.getState().setGistConfig({ gistId: json.id });
  return json.id;
};

// 从 Gist 拉取并还原到本地
export const pullFromGist = async () => {
  const { gistToken, gistId, gistFilename } = useSyncStore.getState();
  if (!gistToken || !gistId) throw new Error('请先同步一次以创建 Gist');
  const res = await fetch(`${API}/${gistId}`, { headers: headers(gistToken) });
  if (!res.ok) throw new Error(gistError(res.status, await readError(res)));
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
