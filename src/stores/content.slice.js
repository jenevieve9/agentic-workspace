// src/stores/content.slice.js
// 内容工坊数据层：AI 辅助内容生产的草稿与历史记录
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const getToday = () => new Date().toISOString().slice(0, 10);

export const useContentStore = create(
  persist(
    (set) => ({
      contents: [],
      addContent: (content) =>
        set((state) => ({
          contents: [
            { id: generateId(), date: getToday(), status: '草稿', ...content },
            ...state.contents,
          ],
        })),
      updateContent: (id, updates) =>
        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteContent: (id) =>
        set((state) => ({
          contents: state.contents.filter((c) => c.id !== id),
        })),
    }),
    { name: 'content-storage' }
  )
);
