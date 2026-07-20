// src/stores/goals.slice.js
// 年度目标数据层：含里程碑(milestones) + 子任务(subTasks)，进度自动计算
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// 初始数据（从原始 HTML 迁移，补齐为完整的 7 个年度目标）
const DEFAULT_GOALS = [
  {
    id: 'g1',
    title: '职场跳槽',
    description: '10月后入职出海甲方，薪资28-30K；年底攒下40个',
    status: '进行中',
    targetDate: '2026-12-31',
    tags: ['职场', '跳槽'],
    milestones: [
      { id: 'm1', title: '7月完成网页简历与技能蒸馏', dueDate: '2026-07-31', done: false },
      { id: 'm2', title: '8月集中面试，锁定Offer', dueDate: '2026-08-31', done: false },
      { id: 'm3', title: '9月初向现公司提离职', dueDate: '2026-09-05', done: false },
    ],
    subTasks: [
      { id: 'st1', content: '每周投5家简历（8月开始）', done: false },
      { id: 'st2', content: '准备雅思计划', done: false },
    ],
  },
  {
    id: 'g2',
    title: 'AI副业',
    description: '聚焦AI出海营销，年底累计10万',
    status: '进行中',
    targetDate: '2026-12-31',
    tags: ['AI', '副业'],
    milestones: [
      { id: 'm4', title: '跑通出海内容案例', dueDate: '2026-07-31', done: false },
      { id: 'm5', title: 'Q3变现4万', dueDate: '2026-09-30', done: false },
      { id: 'm6', title: 'Q4启动轻度咨询客户', dueDate: '2026-12-31', done: false },
    ],
    subTasks: [{ id: 'st3', content: '每周发布2条出海内容', done: false }],
  },
  {
    id: 'g3',
    title: '减肥修身',
    description: '婚礼前到110斤，整体体态与气质提升',
    status: '进行中',
    targetDate: '2026-10-01',
    tags: ['减肥', '体态'],
    milestones: [
      { id: 'm7', title: '7月瘦肚子+手臂+骨盆前倾→120斤', dueDate: '2026-07-31', done: false },
      { id: 'm8', title: '8月减脂+瘦腿→116斤', dueDate: '2026-08-31', done: false },
      { id: 'm9', title: '9月体态+面部协调→110斤', dueDate: '2026-09-30', done: false },
    ],
    subTasks: [
      { id: 'st4', content: '56天打卡不间断', done: false },
      { id: 'st5', content: '纯净饮食严格禁糖油', done: false },
      { id: 'st6', content: '早睡不夜宵', done: false },
    ],
  },
  {
    id: 'g4',
    title: '驾照+买车',
    description: '拿下驾照，购入代步车，提升通勤与自由度',
    status: '进行中',
    targetDate: '2026-11-30',
    tags: ['驾照', '买车'],
    milestones: [
      { id: 'm10', title: '科二高分过', dueDate: '2026-08-15', done: false },
      { id: 'm11', title: '科三练车', dueDate: '2026-09-30', done: false },
      { id: 'm12', title: '拿证 + 买车', dueDate: '2026-11-30', done: false },
    ],
    subTasks: [
      { id: 'st7', content: '每周练车2次', done: false },
      { id: 'st8', content: '理论刷题', done: false },
    ],
  },
  {
    id: 'g5',
    title: '养生系统',
    description: '建立可长期维持的养生习惯，稳定精力与状态',
    status: '进行中',
    targetDate: '2026-12-31',
    tags: ['养生', '习惯'],
    milestones: [
      { id: 'm13', title: '建立固定作息表', dueDate: '2026-08-31', done: false },
      { id: 'm14', title: '季度体检', dueDate: '2026-10-31', done: false },
    ],
    subTasks: [
      { id: 'st9', content: '每日冥想', done: false },
      { id: 'st10', content: '早睡早起', done: false },
      { id: 'st11', content: '饮食管理', done: false },
    ],
  },
  {
    id: 'g6',
    title: '婚礼',
    description: '备婚全流程落地，顺利完婚',
    status: '进行中',
    targetDate: '2026-10-01',
    tags: ['婚礼', '备婚'],
    milestones: [
      { id: 'm15', title: '定酒店', dueDate: '2026-08-31', done: false },
      { id: 'm16', title: '拍婚纱照', dueDate: '2026-09-15', done: false },
      { id: 'm17', title: '婚礼执行', dueDate: '2026-10-01', done: false },
    ],
    subTasks: [
      { id: 'st12', content: '预算表', done: false },
      { id: 'st13', content: '宾客名单', done: false },
      { id: 'st14', content: '流程清单', done: false },
    ],
  },
  {
    id: 'g7',
    title: '考研 PHBS',
    description: '备考北大汇丰(PHBS)，冲刺上岸',
    status: '进行中',
    targetDate: '2026-12-31',
    tags: ['考研', 'PHBS'],
    milestones: [
      { id: 'm18', title: '完成基础课', dueDate: '2026-09-30', done: false },
      { id: 'm19', title: '模考', dueDate: '2026-11-30', done: false },
      { id: 'm20', title: '初试', dueDate: '2026-12-31', done: false },
    ],
    subTasks: [
      { id: 'st15', content: '每日英语', done: false },
      { id: 'st16', content: '专业课复习', done: false },
      { id: 'st17', content: '数学', done: false },
    ],
  },
];

export const useGoalsStore = create(
  persist(
    (set) => ({
      goals: DEFAULT_GOALS,
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            {
              id: generateId(),
              status: '进行中',
              tags: [],
              milestones: [],
              subTasks: [],
              ...goal,
            },
            ...state.goals,
          ],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      toggleSubTask: (goalId, subId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  subTasks: g.subTasks.map((s) =>
                    s.id === subId ? { ...s, done: !s.done } : s
                  ),
                }
              : g
          ),
        })),
      toggleMilestone: (goalId, mileId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) =>
                    m.id === mileId ? { ...m, done: !m.done } : m
                  ),
                }
              : g
          ),
        })),
    }),
    { name: 'goals-storage' }
  )
);
