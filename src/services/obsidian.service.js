// src/services/obsidian.service.js
// Obsidian 联动框架：URL Scheme 跳转 + 可选 Local REST API
// 配置来源：src/stores/obsidian.slice.js（仓库名 / REST 开关 / API Key）
import { useObsidianStore } from '../stores/obsidian.slice';

const REST_BASE = 'http://127.0.0.1:27123';
const todayStr = () => new Date().toISOString().slice(0, 10);

// 读取当前配置（在非 React 上下文中也可调用）
const getConfig = () => useObsidianStore.getState();

// 新建/打开一条笔记（obsidian://new）
export const openObsidianNew = (title, content = '') => {
  const { vault } = getConfig();
  const name = encodeURIComponent(title);
  const body = encodeURIComponent(
    content || `# ${title}\n\n## 今日状态\n-\n\n## 思考\n-`
  );
  const url = `obsidian://new?vault=${encodeURIComponent(vault)}&name=${name}&content=${body}`;
  window.open(url, '_blank');
};

// 按文件名打开既有笔记；不支持时回退到新建
export const openObsidianByPath = (date) => {
  const name = `日记_${date}`;
  const url = `obsidian://open?vault=${encodeURIComponent(getConfig().vault)}&file=${encodeURIComponent(name)}`;
  try {
    window.open(url, '_blank');
  } catch (e) {
    openObsidianNew(name);
  }
};

// 将一条思考同步为 Obsidian 笔记
export const syncThoughtToObsidian = (content, category = '') => {
  const date = todayStr();
  const title = category ? `${category} · ${date}` : `思考_${date}`;
  openObsidianNew(title, `# ${title}\n\n${content}`);
};

// ===== Local REST API（可选，需在 Obsidian 安装 Local REST API 插件）=====

// 通过 REST API 创建/覆盖一条笔记（写入指定路径，如 01_Daily/日记_2026-07-20.md）
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

// 通过 REST API 读取某文件夹下的笔记列表（用于日记 / 每日笔记联动）
export const fetchNotesViaRest = async (folder = '01_Daily') => {
  const { apiKey } = getConfig();
  const res = await fetch(`${REST_BASE}/vault/${encodeURIComponent(folder)}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Obsidian REST 读取失败');
  return res.json();
};

// 测试 REST API 连接（用于设置页“测试连接”）
export const testObsidianRest = async () => {
  const { apiKey } = getConfig();
  if (!apiKey) throw new Error('请先填写 API Key');
  const res = await fetch(`${REST_BASE}/`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return res.ok;
};

// 一键将今日日记写入 Obsidian（若启用 REST 则用 API，否则用 URL Scheme）
export const writeTodayDiary = async (content = '') => {
  const { restEnabled } = getConfig();
  const date = todayStr();
  const title = `日记_${date}`;
  if (restEnabled) {
    await createNoteViaRest(`01_Daily/${title}.md`, content || `# ${title}\n\n## 今日状态\n-\n\n## 思考\n-`);
  } else {
    openObsidianNew(title, content);
  }
};
