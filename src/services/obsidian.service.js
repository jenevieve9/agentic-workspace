// src/services/obsidian.service.js
// Obsidian 联动框架：URL Scheme（用 file 参数指定完整路径）+ 可选 Local REST API
// 配置来源：src/stores/obsidian.slice.js（仓库名 / REST 开关 / API Key）
import { useObsidianStore } from '../stores/obsidian.slice';

const REST_BASE = 'http://127.0.0.1:27123';
const todayStr = () => new Date().toISOString().slice(0, 10);

// 读取当前配置（在非 React 上下文中也可调用）
const getConfig = () => useObsidianStore.getState();

const getVault = () => {
  const vault = (getConfig().vault || '').trim();
  if (!vault) throw new Error('请先在「系统联动」设置 Obsidian 仓库名');
  return vault;
};

// 新建/打开一条笔记（obsidian://new）
// path: 可选，传入时使用 file 参数强制写到指定路径（覆盖 Obsidian 默认位置）
export const openObsidianNew = (title, content = '', path = null) => {
  const vault = getVault();
  const body = encodeURIComponent(
    content || `# ${title}\n\n## 今日状态\n-\n\n## 思考\n-`
  );
  // 优先用 file 参数（指定完整路径），否则退回 name（位置由 Obsidian 偏好决定）
  const fileOrName = path
    ? `file=${encodeURIComponent(path)}`
    : `name=${encodeURIComponent(title)}`;
  const url = `obsidian://new?vault=${encodeURIComponent(vault)}&${fileOrName}&content=${body}`;
  window.open(url, '_blank');
};

// 按文件名打开既有笔记；path 形如 "01_Daily/2026/07/日记_2026-07-21"
export const openObsidianByPath = (date) => {
  const yyyy = new Date(date).getFullYear();
  const mm = String(new Date(date).getMonth() + 1).padStart(2, '0');
  const fullPath = `01_Daily/${yyyy}/${mm}/日记_${date}`;
  const vault = getVault();
  const url = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(fullPath)}`;
  try {
    window.open(url, '_blank');
  } catch {
    openObsidianNew(`日记_${date}`, '', fullPath);
  }
};

// 将一条思考同步为 Obsidian 笔记（写入 03_Thoughts/{category}/）
export const syncThoughtToObsidian = (content, category = '') => {
  const date = todayStr();
  const title = `思考_${date}`;
  const path = category ? `03_Thoughts/${category}/${title}` : `03_Thoughts/${title}`;
  const body = `# 思考记录\n\n**分类**: ${category || '未分类'}\n**日期**: ${date}\n\n${content}`;
  openObsidianNew(title, body, path);
};

// ===== Local REST API（可选，需在 Obsidian 安装 Local REST API 插件）=====

// 通过 REST API 创建/覆盖一条笔记（写入指定路径，如 01_Daily/2026/07/日记_2026-07-21.md）
export const createNoteViaRest = async (path, content) => {
  const { apiKey } = getConfig();
  const res = await fetch(`${REST_BASE}/vault/${encodeURIComponent(path)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'text/markdown',
    },
    body: content,
  });
  if (!res.ok) throw new Error(`Obsidian REST 创建失败: ${res.status}`);
  return res.json();
};

// 通过 REST API 读取某文件夹下的笔记列表
export const fetchNotesViaRest = async (folder = '01_Daily') => {
  const { apiKey } = getConfig();
  const res = await fetch(`${REST_BASE}/vault/${encodeURIComponent(folder)}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Obsidian REST 读取失败');
  return res.json();
};

// 测试 REST API 连接
export const testObsidianRest = async () => {
  const { apiKey } = getConfig();
  if (!apiKey) throw new Error('请先填写 API Key');
  const res = await fetch(`${REST_BASE}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return res.ok;
};

// 一键将今日日记写入 Obsidian：URL Scheme 用 file 参数指定 01_Daily/YYYY/MM/ 路径
export const writeTodayDiary = async (content = '') => {
  const { restEnabled } = getConfig();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const date = todayStr();
  const title = `日记_${date}`;
  const path = `01_Daily/${yyyy}/${mm}/${title}`;
  if (restEnabled) {
    await createNoteViaRest(`${path}.md`, content || `# ${title}\n\n## 今日状态\n-\n\n## 思考\n-`);
  } else {
    openObsidianNew(title, content, path);
  }
};
