// src/stores/monthly.slice.js
// 月度目标数据层：每个目标含关键结果(keyResults) + 关联年度目标(goalId)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const currentMonth = new Date().toISOString().slice(0, 7);

const DEFAULT_MONTHLIES = [
  {
    id: 'mo1',
    title: '网页简历与技能蒸馏',
    month: currentMonth,
    goalId: 'g1',
    done: false,
    keyResults: [
      { id: 'kr1', content: '完成技能蒸馏清单', done: false },
      { id: 'kr2', content: '输出网页简历 v1', done: false },
    ],
  },
  {
    id: 'mo2',
    title: '跑通出海内容案例',
    month: currentMonth,
    goalId: 'g2',
    done: false,
    keyResults: [
      { id: 'kr3', content: '跑通1个出海内容案例', done: false },
      { id: 'kr4', content: '发布8条出海内容', done: false },
    ],
  },
  {
    id: 'mo3',
    title: '7月体态与减脂',
    month: currentMonth,
    goalId: 'g3',
    done: false,
    keyResults: [
      { id: 'kr5', content: '7月打卡≥20天', done: false },
      { id: 'kr6', content: '纯净饮食执行', done: false },
    ],
  },
  {
    id: 'mo4',
    title: '科二备考',
    month: currentMonth,
    goalId: 'g4',
    done: false,
    keyResults: [
      { id: 'kr7', content: '完成科二练车', done: false },
      { id: 'kr8', content: '参加科二考试', done: false },
    ],
  },
  {
    id: 'mo5',
    title: '建立养生作息',
    month: currentMonth,
    goalId: 'g5',
    done: false,
    keyResults: [
      { id: 'kr9', content: '固定作息表', done: false },
      { id: 'kr10', content: '冥想打卡≥15天', done: false },
    ],
  },
];

export const useMonthlyStore = create(
  persist(
    (set) => ({
      monthlies: DEFAULT_MONTHLIES,
      addMonthly: (data) =>
        set((state) => ({
          monthlies: [
            {
              id: generateId(),
              month: currentMonth,
              done: false,
              keyResults: (data.keyResults || []).map((c) => ({
                id: generateId(),
                content: c,
                done: false,
              })),
              ...data,
            },
            ...state.monthlies,
          ],
        })),
      updateMonthly: (id, patch) =>
        set((state) => ({
          monthlies: state.monthlies.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        })),
      removeMonthly: (id) =>
        set((state) => ({
          monthlies: state.monthlies.filter((m) => m.id !== id),
        })),
      toggleMonthly: (id) =>
        set((state) => ({
          monthlies: state.monthlies.map((m) =>
            m.id === id ? { ...m, done: !m.done } : m
          ),
        })),
      toggleKeyResult: (monthlyId, krId) =>
        set((state) => ({
          monthlies: state.monthlies.map((m) =>
            m.id === monthlyId
              ? {
                  ...m,
                  keyResults: m.keyResults.map((k) =>
                    k.id === krId ? { ...k, done: !k.done } : k
                  ),
                }
              : m
          ),
        })),
      addKeyResult: (monthlyId, content) =>
        set((state) => ({
          monthlies: state.monthlies.map((m) =>
            m.id === monthlyId
              ? {
                  ...m,
                  keyResults: [
                    ...m.keyResults,
                    { id: generateId(), content, done: false },
                  ],
                }
              : m
          ),
        })),
    }),
    { name: 'monthly-storage' }
  )
);
