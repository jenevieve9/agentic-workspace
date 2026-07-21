// src/stores/training.slice.js
// 训练日程表打卡状态：按日期+时段存储完成状态
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 晨间训练（7:00-8:00）
export const MORNING = [
  { id: 'm1', name: '欧阳春晓沙漏', time: '20min', url: 'https://www.bilibili.com/video/BV1sv4y1h7MB/' },
  { id: 'm2', name: '刘板筋瘦手臂', time: '10min', url: 'https://www.bilibili.com/video/BV1juYmztEGr/' },
  { id: 'm3', name: '骨盆回正', time: '8min', url: 'https://www.bilibili.com/video/BV14w411h7rj/' },
  { id: 'm4', name: '体态大师气场女王', time: '21min', url: 'https://www.bilibili.com/video/BV1q64y1u7Lc/' },
  { id: 'm5', name: '正念冥想', time: '15min', url: 'https://www.xiaohongshu.com/search_result/67c5b946000000000900c75c' },
];

// 晚间训练（20:30-22:00）
export const EVENING = [
  { id: 'e1', name: 'Elen fi腹部训练', time: '20min', url: 'https://www.bilibili.com/video/BV1pHqVBKEYj/' },
  { id: 'e2', name: 'Mady Morrison拉伸', time: '17min', url: 'https://www.bilibili.com/video/BV15V411a7cV/' },
  { id: 'e3', name: '欧阳春晓少女背', time: '15min', url: 'https://www.bilibili.com/video/BV1Ha4y147Sd/' },
  { id: 'e4', name: '日本体态大师', time: '16min', url: 'https://www.bilibili.com/video/BV1aL411Q7VN/' },
  { id: 'e5', name: 'JO姐有氧5000步', time: '30min', url: 'https://www.bilibili.com/video/BV193411N7Ew/' },
];

export const useTrainingStore = create(
  persist(
    (set) => ({
      checkins: {}, // key: "2026-07-21-morning" / "2026-07-21-evening"
      toggleCheckin: (date, session) =>
        set((state) => {
          const key = `${date}-${session}`;
          return { checkins: { ...state.checkins, [key]: !state.checkins[key] } };
        }),
    }),
    { name: 'training-storage' }
  )
);
