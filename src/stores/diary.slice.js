// src/stores/diary.slice.js
// 日记数据层：以日期为 key 存储 { content, reflections, tags }，持久化到 localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const dayOffset = (off) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - off);
  return dt.toISOString().slice(0, 10);
};

// 首次运行的演示数据（与 Obsidian 双向联动：本地索引 + 跳转）
const SEED = {
  [dayOffset(1)]: {
    content:
      '今天完成了网页简历的初稿，结构比想象中清晰。下午跟练了欧阳春晓的腹训，核心收紧的感觉对了。晚上控制住了没吃夜宵。',
    reflections: '坚持比强度更重要，先把习惯立住。',
    tags: ['减肥', '人生思考'],
  },
  [dayOffset(2)]: {
    content:
      '面试准备进入集中期，整理了三个出海案例。冥想第 12 天，脑雾明显减轻，下午的效率高了不少。',
    reflections: '输出倒逼输入，每周两条内容要稳住。',
    tags: ['AI副业', '养生'],
  },
  [dayOffset(3)]: {
    content:
      '和先生把婚礼预算表过了一遍，定酒店的时间线拉出来了。沟通顺畅，情绪平稳。',
    reflections: '共同目标让关系更踏实。',
    tags: ['婚礼', '婚姻生活'],
  },
};

export const countWords = (s = '') => s.replace(/\s/g, '').length;

export const useDiaryStore = create(
  persist(
    (set) => ({
      diaries: SEED,
      addDiary: (date, data) =>
        set((state) => ({ diaries: { ...state.diaries, [date]: data } })),
      updateDiary: (date, patch) =>
        set((state) => ({
          diaries: { ...state.diaries, [date]: { ...state.diaries[date], ...patch } },
        })),
      deleteDiary: (date) =>
        set((state) => {
          const next = { ...state.diaries };
          delete next[date];
          return { diaries: next };
        }),
    }),
    { name: 'diary-storage' }
  )
);

export const diarySummary = (content = '', len = 60) =>
  content.length > len ? content.slice(0, len) + '…' : content;

// 按日期降序排列的条目
export const sortedDiaries = (diaries) =>
  Object.entries(diaries)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
