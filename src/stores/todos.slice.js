// src/stores/todos.slice.js
// 每日 TODO 数据层：按日期分组 { 'YYYY-MM-DD': [{ id, content, done }] }
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = new Date().toISOString().slice(0, 10);

const DEFAULT_TODOS = {
  [today]: [
    { id: generateId(), content: '晨间冥想 10 分钟', done: false },
    { id: generateId(), content: '完成项目周报', done: false },
    { id: generateId(), content: '健身打卡（晚 20:30）', done: false },
  ],
};

export const useTodosStore = create(
  persist(
    (set) => ({
      todos: DEFAULT_TODOS,
      addTodo: (date, content) =>
        set((state) => {
          const key = date || today;
          return {
            todos: {
              ...state.todos,
              [key]: [
                ...(state.todos[key] || []),
                { id: generateId(), content, done: false },
              ],
            },
          };
        }),
      toggleTodo: (date, id) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: (state.todos[date] || []).map((t) =>
              t.id === id ? { ...t, done: !t.done } : t
            ),
          },
        })),
      updateTodo: (date, id, content) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: (state.todos[date] || []).map((t) =>
              t.id === id ? { ...t, content } : t
            ),
          },
        })),
      removeTodo: (date, id) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: (state.todos[date] || []).filter((t) => t.id !== id),
          },
        })),
    }),
    { name: 'todos-storage' }
  )
);
