// src/stores/wedding.slice.js
// 备婚任务全局状态，持久化到 localStorage（带完成态，供看板计算进度）
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWeddingStore = create(
  persist(
    (set) => ({
      tasks: [
        { id: 1, title: '确定婚礼策划', done: false },
        { id: 2, title: '发请帖', done: false },
        { id: 3, title: '试婚纱', done: false },
      ],
      addTask: (title) =>
        set((state) => ({
          tasks: [...state.tasks, { id: Date.now(), title, done: false }],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      updateTask: (id, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, title } : t)),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    }),
    { name: 'wedding-store' }
  )
);
