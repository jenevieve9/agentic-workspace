// src/stores/todos.slice.js
// 每日 TODO 数据层：按日期分组，每条自动附带 weekId，与周计划联动
// { 'YYYY-MM-DD': [{ id, content, done, weekId: 'YYYY-Www' }] }
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Week ID 计算：以 1 月 1 日为基准
export const getWeekId = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

const today = new Date().toISOString().slice(0, 10);
const todayWeek = getWeekId(today);

const DEFAULT_TODOS = {
  [today]: [
    { id: generateId(), content: '晨间冥想 10 分钟', done: false, weekId: todayWeek },
    { id: generateId(), content: '完成项目周报', done: false, weekId: todayWeek },
    { id: generateId(), content: '健身打卡（晚 20:30）', done: false, weekId: todayWeek },
  ],
};

export const useTodosStore = create(
  persist(
    (set) => ({
      todos: DEFAULT_TODOS,
      addTodo: (date, content) =>
        set((state) => {
          const key = date || today;
          const wid = getWeekId(key);
          return {
            todos: {
              ...state.todos,
              [key]: [
                ...(state.todos[key] || []),
                { id: generateId(), content, done: false, weekId: wid },
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
    {
      name: 'todos-storage',
      version: 1,
      migrate: (persisted, version) => {
        if (version === 0) {
          const todos = { ...(persisted.todos || persisted) };
          Object.keys(todos).forEach((date) => {
            const wid = getWeekId(date);
            todos[date] = (todos[date] || []).map((t) => ({
              ...t,
              weekId: t.weekId || wid,
            }));
          });
          return { ...persisted, todos };
        }
        return persisted;
      },
    }
  )
);
