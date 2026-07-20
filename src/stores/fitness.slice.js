// src/stores/fitness.slice.js
// 减肥修身全局状态：56天打卡 / 饮食 / 冥想 / 早睡 / 阶段目标 / 训练计划 / 纯净餐食
// 全部持久化到 localStorage，刷新不丢
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const seedExercises = {
  肚子: [
    { id: 'b1', name: '0基础欧阳春晓沙漏 20分钟', url: 'https://www.bilibili.com/video/BV1sv4y1h7MB/', note: '全程跟练' },
    { id: 'b2', name: 'Elen fi 腹部训练 20分钟', url: 'https://www.bilibili.com/video/BV1pHqVBKEYj/', note: '全程收紧核心，腹部发力' },
    { id: 'b3', name: '什么是收紧核心（欧阳春晓）', url: 'https://www.xiaohongshu.com/discovery/item/66b1ad69000000001e018467', note: '执行细节，保留链接' },
  ],
  手臂肉肩膀驼背: [
    { id: 'a1', name: '刘板筋瘦手臂+副乳 10分钟', url: 'https://www.bilibili.com/video/BV1juYmztEGr/', note: '' },
    { id: 'a2', name: '欧阳春晓少女背 15分钟', url: 'https://www.bilibili.com/video/BV1Ha4y147Sd/', note: '' },
  ],
  肩膀内扣: [
    { id: 's1', name: '体态大师气场女王 21分钟', url: 'https://www.bilibili.com/video/BV1q64y1u7Lc/', note: '' },
    { id: 's2', name: '日本体态大师改善圆肩驼背 16分钟', url: 'https://www.bilibili.com/video/BV1aL411Q7VN/', note: '' },
  ],
  骨盆回正: [
    { id: 'p1', name: '骨盆回正 早晚8分钟', url: 'https://www.bilibili.com/video/BV14w411h7rj/', note: '' },
  ],
  有氧运动: [
    { id: 'c1', name: '7月：JO姐 5000步 30分钟', url: 'https://www.bilibili.com/video/BV193411N7Ew/', note: '' },
    { id: 'c2', name: '周六野全身燃脂', url: 'https://www.bilibili.com/video/BV1sA411Q7R3/', note: '' },
  ],
  拉伸: [
    { id: 'l1', name: 'Mady Morrison 17分钟', url: 'https://www.bilibili.com/video/BV15V411a7cV/', note: '' },
  ],
};

const seedDiet = {
  breakfast: {
    周一: '肉包+茶叶蛋', 周二: '纯美式+半个红薯', 周三: '纯美式+半根玉米',
    周四: '无糖拿铁+全麦吐司', 周五: '麦当劳汉堡（早午餐）', 周六: '红薯+家里咖啡', 周日: '红薯+家里咖啡',
  },
  lunch: {
    周一: '前一天带饭', 周二: '沙县鸡腿饭（多青菜、鸡腿去皮）', 周三: '鸡胸肉三明治',
    周四: '麻辣烫指定食物（无油/虾肉菜）', 周五: '麦当劳汉堡+苹果', 周六: '自己做减脂菜（牛、虾、鸡胸肉）', 周日: '自己做减脂菜（牛、虾、鸡胸肉）',
  },
  dinner: {
    周一: '不吃', 周二: '运动后快碳', 周三: '运动后快碳', 周四: '运动后快碳',
    周五: '水煮菜', 周六: '自己做减脂菜', 周日: '自己做减脂菜',
  },
  snack: '每天16:00 一个苹果/番茄/黄瓜（防低血糖）【周日买好】',
  water: '每天2000ml以上，可加柠檬片/茶叶',
  avoid: '含糖饮料、零食、奶茶、炸鸡、螺蛳粉、夜宵（严格禁止）',
};

export const useFitnessStore = create(
  persist(
    (set) => ({
      // 打卡数据
      fitness56: {},
      meals: {},
      meditation: {},
      sleep: {},

      // 阶段目标（月度安排）
      phases: [
        { id: 'ph1', period: '7月', title: '瘦肚子+手臂+骨盆前倾+直角肩+减脂', target: '→ 120斤' },
        { id: 'ph2', period: '8月', title: '减脂+瘦腿+肩膀+肚子+英伦大提升', target: '→ 116斤' },
        { id: 'ph3', period: '9月', title: '肩膀+手臂+整体体态+面部协调+力线', target: '→ 110斤' },
        { id: 'ph4', period: '10-12月', title: '巩固维持', target: '→ 105斤' },
      ],

      // 训练计划（分部位）
      exercises: seedExercises,

      // 纯净餐食
      diet: seedDiet,

      // ===== 打卡动作 =====
      toggleDay: (date) =>
        set((state) => ({ fitness56: { ...state.fitness56, [date]: !state.fitness56[date] } })),
      toggleMeal: (day, type) =>
        set((state) => {
          const dayMeals = state.meals[day] || {};
          return { meals: { ...state.meals, [day]: { ...dayMeals, [type]: !dayMeals[type] } } };
        }),
      toggleMeditation: (date) =>
        set((state) => ({ meditation: { ...state.meditation, [date]: !state.meditation[date] } })),
      toggleSleep: (date) =>
        set((state) => ({ sleep: { ...state.sleep, [date]: !state.sleep[date] } })),

      // ===== 阶段目标增删改 =====
      updatePhase: (id, patch) =>
        set((state) => ({ phases: state.phases.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      addPhase: (phase) =>
        set((state) => ({ phases: [...state.phases, { id: Date.now().toString(), ...phase }] })),
      removePhase: (id) =>
        set((state) => ({ phases: state.phases.filter((p) => p.id !== id) })),

      // ===== 训练计划增删改 =====
      addExercise: (cat, ex) =>
        set((state) => ({
          exercises: { ...state.exercises, [cat]: [...(state.exercises[cat] || []), { id: Date.now().toString(), ...ex }] },
        })),
      updateExercise: (cat, id, patch) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [cat]: (state.exercises[cat] || []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExercise: (cat, id) =>
        set((state) => ({
          exercises: {
            ...state.exercises,
            [cat]: (state.exercises[cat] || []).filter((e) => e.id !== id),
          },
        })),

      // ===== 饮食增删改 =====
      updateDiet: (meal, day, val) =>
        set((state) => ({ diet: { ...state.diet, [meal]: { ...state.diet[meal], [day]: val } } })),
      updateDietNote: (key, val) =>
        set((state) => ({ diet: { ...state.diet, [key]: val } })),
    }),
    { name: 'fitness-store' }
  )
);
