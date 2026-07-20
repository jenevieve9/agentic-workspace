// src/stores/weddingData.slice.js
// 备婚真实数据（提取自 https://jenevieve9.github.io/my-wedding/ ），Notion 风格重绘用
// 该页面是 my-wedding 的「工作台内镜像」：勾选状态本地持久化，完整交互仍在原站。
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWeddingData = create(
  persist(
    (set) => ({
      header: {
        title: 'The Wedding Chronicle',
        sub: '2026.10.02 Reception · 2026.10.03 Ceremony',
        weightStart: '126',
        weightTarget: '100',
        source: 'https://jenevieve9.github.io/my-wedding/',
      },
      weeklyFocus: [
        { id: 'wf_1', text: '驾照拿本通关', desc: '提车准备前提' },
        { id: 'wf_2', text: '跟策划敲定第一版效果方案', desc: '7月底正式开始' },
      ],
      categories: [
        {
          id: 'cat_1', icon: '🎬', title: '四大金刚 & 婚策团队',
          items: [
            { id: 'item_1_1', title: '摄影跟拍团队尾款对接', meta: '💰 待付尾款: ￥6,000', done: true },
            { id: 'item_1_2', title: '跟妆师 & 主持人沟通', meta: '🎙️ 人员已锁定', done: true },
            { id: 'item_1_3', title: '婚礼策划对接', meta: '📐 待付尾款: ￥10,000 · 7月底启动', done: false },
            { id: 'item_1_4', title: '婚纱与新郎礼服定制', meta: '🗡️ 广州/凯里 待定', done: false },
          ],
        },
        {
          id: 'cat_2', icon: '🏨', title: '婚宴酒店 & 物资准备',
          items: [
            { id: 'item_2_1', title: '缴纳婚宴酒店定金', meta: '💳 10.2 - 10.3 需付 ￥3,000', done: false },
            { id: 'item_2_2', title: '朋友住宿酒店预订', meta: '🔑 8月初需定房', done: false },
            { id: 'item_2_3', title: '男方婚房布置', meta: '🛏️ 已定红色四件套，敬茶杯待定', done: false },
          ],
        },
        {
          id: 'cat_3', icon: '👰', title: '新娘陪嫁 & 个人筹备',
          items: [
            { id: 'item_3_1', title: '陪嫁大件提车', meta: '🔑 计划9月中旬前提车', done: false },
            { id: 'item_3_2', title: '女方五金（金饰）购入', meta: '💎 计划8月底前购入', done: false },
          ],
        },
      ],
      dietData: [
        { day: '周一', workout: '慢跑3公里', food: '鸡胸肉+水煮蛋+燕麦' },
        { day: '周二', workout: 'HIIT操20分钟', food: '牛肉+西兰花' },
        { day: '周三', workout: '拉伸操', food: '鳕鱼+糙米饭' },
        { day: '周四', workout: '慢跑3公里', food: '清炒生菜+大虾' },
        { day: '周五', workout: '休息拉伸', food: '牛肉+紫薯' },
        { day: '周六', workout: '羽毛球', food: '全天轻食沙拉' },
        { day: '周日', workout: '休息', food: '健康随心欺骗餐' },
      ],
      licenseData: [
        { date: '7月25日', task: '📝 科目一理论大捷' },
        { date: '8月25日', task: '🪪 科目二、三、四连通拿驾照！' },
      ],
      milestones: [
        { date: '7.15', event: '备婚计划启动' },
        { date: '7.25', event: '科目一考试' },
        { date: '8.01', event: '住宿确定' },
        { date: '8.25', event: '拿本/五金采购' },
        { date: '9.01', event: '电子请柬 / 贵州面谈细节' },
        { date: '10.2', event: '幸福接亲' },
        { date: '10.3', event: '🎉 梦中婚礼' },
      ],
      // 切换某分类下某任务的完成态（本地持久化）
      toggleTask: (catId, itemId) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id !== catId
              ? cat
              : {
                  ...cat,
                  items: cat.items.map((it) =>
                    it.id === itemId ? { ...it, done: !it.done } : it
                  ),
                }
          ),
        })),
    }),
    { name: 'wedding-data-store' }
  )
);
