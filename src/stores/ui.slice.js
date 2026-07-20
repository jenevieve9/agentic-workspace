// src/stores/ui.slice.js
// 页面标题可编辑：标题持久化到 localStorage，刷新不丢
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_TITLES = {
  dashboard: '看板',
  goals: '年度目标',
  monthly: '月度目标',
  weekly: '周计划',
  todo: '每日TODO',
  diary: '日记',
  thoughts: '思考积累',
  fitness: '减肥修身',
  wedding: '备婚',
  content: '内容工坊',
  settings: '系统联动',
};

export const useUiStore = create(
  persist(
    (set) => ({
      titles: DEFAULT_TITLES,
      setPageTitle: (key, title) =>
        set((state) => ({ titles: { ...state.titles, [key]: title } })),
    }),
    { name: 'ui-storage' }
  )
);
