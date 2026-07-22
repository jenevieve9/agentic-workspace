// src/stores/weekly.slice.js
// 周计划：weeklyPlans 存本周重点 summary，任务从 todos 中按 weekId 实时筛选
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// plan 保留用于向后兼容（旧版周计划中直接存任务），新版任务走 todos slice
const seedPlan = DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {});
seedPlan['周一'] = [{ id: Date.now(), text: '项目周报', done: false }];

export const useWeeklyStore = create(
  persist(
    (set) => ({
      // 旧版周计划任务（保留兼容）
      plan: seedPlan,

      // 新版：每周摘要 { "2026-W30": { summary: "本周重点内容..." } }
      weeklyPlans: {},

      // 设置某周的摘要（自动保存）
      setWeeklySummary: (weekId, summary) =>
        set((state) => ({
          weeklyPlans: {
            ...state.weeklyPlans,
            [weekId]: { ...(state.weeklyPlans[weekId] || {}), summary },
          },
        })),

      // ---- 旧版 action（保留，避免引用报错） ----
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
            [day]: (state.plan[day] || []).map((t) =>
              t.id === id ? { ...t, text } : t
            ),
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
