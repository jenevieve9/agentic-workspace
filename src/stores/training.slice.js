// src/stores/training.slice.js
// 训练日程表打卡状态：{ '2026-07-21': { morning: true, evening: false } }
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
  persist(
    (set, get) => ({
      trainingLog: {},

      toggleTraining: (date, session) =>
        set((state) => ({
          trainingLog: {
            ...state.trainingLog,
            [date]: {
              ...(state.trainingLog[date] || {}),
              [session]: !state.trainingLog[date]?.[session],
            },
          },
        })),

      getTrainingStatus: (date, session) => {
        const log = get().trainingLog;
        return !!log[date]?.[session];
      },
    }),
    { name: 'training-storage' }
  )
);
