// src/stores/thoughts.slice.js
// 思考积累数据层：9 个分类，支持增/改/删，持久化到 localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CATEGORIES = [
  '人生思考',
  '女性成长',
  'AI创业',
  'AI公众号文章',
  'AI工具积累',
  '婚姻生活',
  '职场晋升',
  '人性洞察',
  '旅行日记',
];

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => new Date().toISOString().slice(0, 10);

const SEED = [
  { id: generateId(), category: 'AI创业', content: '出海营销需要更本地化的内容策略', date: '2026-07-19' },
  { id: generateId(), category: '职场晋升', content: '面试时要突出项目闭环能力', date: '2026-07-19' },
  { id: generateId(), category: '人生思考', content: '习惯决定命运，系统胜于目标', date: '2026-07-19' },
  { id: generateId(), category: '女性成长', content: '经济独立是底气，不是逞强', date: '2026-07-18' },
];

export const useThoughtsStore = create(
  persist(
    (set) => ({
      thoughts: SEED,
      addThought: (category, content) =>
        set((state) => ({
          thoughts: [{ id: generateId(), category, content, date: today() }, ...state.thoughts],
        })),
      updateThought: (id, patch) =>
        set((state) => ({
          thoughts: state.thoughts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeThought: (id) =>
        set((state) => ({ thoughts: state.thoughts.filter((t) => t.id !== id) })),
    }),
    { name: 'thoughts-storage' }
  )
);
