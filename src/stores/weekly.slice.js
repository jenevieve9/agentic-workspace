// src/stores/weekly.slice.js
// 周计划全局状态，按星期组织任务，持久化到 localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const seedPlan = DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {});
seedPlan['周一'] = [{ id: Date.now(), text: '项目周报', done: false }];

export const useWeeklyStore = create(
  persist(
    (set) => ({
      plan: seedPlan,
      addTask: (day, text) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: [...(state.plan[day] || []), { id: Date.now(), text, done: false }],
          },
        })),
      toggleTask: (day, id) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: (state.plan[day] || []).map((t) =>
              t.id === id ? { ...t, done: !t.done } : t
            ),
          },
        })),
      updateTask: (day, id, text) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: (state.plan[day] || []).map((t) => (t.id === id ? { ...t, text } : t)),
          },
        })),
      removeTask: (day, id) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: (state.plan[day] || []).filter((t) => t.id !== id),
          },
        })),
    }),
    { name: 'weekly-store' }
  )
);

export const WEEK_DAYS = DAYS;
