// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useGoalsStore } from '../stores/goals.slice';
import { useMonthlyStore } from '../stores/monthly.slice';
import { useTodosStore } from '../stores/todos.slice';
import { useFitnessStore } from '../stores/fitness.slice';
import PageTitle from '../components/PageTitle';
import Progress from '../components/Progress';

export default function Dashboard() {
  const { goals } = useGoalsStore();
  const { monthlies } = useMonthlyStore();
  const { todos } = useTodosStore();
  const { fitness56 } = useFitnessStore();

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  // 统计数据
  const totalGoals = goals.length;
  const activeGoals = goals.filter((g) => g.status === '进行中').length;

  // 本月关键结果完成率
  const thisMonthGoals = monthlies.filter((m) => m.month === currentMonth);
  const totalKR = thisMonthGoals.reduce((acc, m) => acc + (m.keyResults?.length || 0), 0);
  const doneKR = thisMonthGoals.reduce(
    (acc, m) => acc + (m.keyResults?.filter((kr) => kr.done).length || 0),
    0
  );
  const krRate = totalKR === 0 ? 0 : Math.round((doneKR / totalKR) * 100);

  // 本周待办（按日期分组，匹配飞书看板规范）
  const todayTodos = (todos[today] || []).filter((t) => !t.done);
  const getWeekDates = () => {
    const now = new Date();
    const dow = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dow + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  };
  const WEEK_LABEL = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDates = getWeekDates();
  const weekTodoMap = weekDates
    .map((date) => ({
      date,
      label: WEEK_LABEL[new Date(date).getDay()],
      items: (todos[date] || []).filter((t) => !t.done),
    }))
    .filter((g) => g.items.length > 0);
  const weekTodoCount = weekTodoMap.reduce((acc, g) => acc + g.items.length, 0);

  // 里程碑路线图：取所有目标中未完成的里程碑，按到期日排序，取最近5个
  const allMilestones = goals.flatMap((g) =>
    (g.milestones || [])
      .filter((m) => !m.done)
      .map((m) => ({ ...m, goalTitle: g.title, goalId: g.id }))
  );
  const sortedMilestones = allMilestones.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  const upcomingMilestones = sortedMilestones.slice(0, 5);

  // 判断里程碑状态
  const getMilestoneStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: '已逾期', color: 'text-red-500 border-red-500' };
    if (diff <= 3) return { label: '即将到期', color: 'text-yellow-600 border-yellow-600' };
    return { label: '进行中', color: 'text-text-secondary border-border' };
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageTitle pageKey="dashboard" subtitle={`${today} · 数据总览`} />

      {/* 第一行：关键指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-md p-5 shadow-sm">
          <div className="text-3xl font-semibold">{totalGoals}</div>
          <div className="text-xs text-text-light font-mono mt-1">总目标</div>
        </div>
        <div className="bg-surface border border-border rounded-md p-5 shadow-sm">
          <div className="text-3xl font-semibold">{activeGoals}</div>
          <div className="text-xs text-text-light font-mono mt-1">进行中</div>
        </div>
        <div className="bg-surface border border-border rounded-md p-5 shadow-sm">
          <div className="text-3xl font-semibold">{krRate}%</div>
          <div className="text-xs text-text-light font-mono mt-1">本月关键结果</div>
        </div>
        <div className="bg-surface border border-border rounded-md p-5 shadow-sm">
          <div className="text-3xl font-semibold">{todayTodos.length}</div>
          <div className="text-xs text-text-light font-mono mt-1">今日待办</div>
        </div>
      </div>

      {/* 第二行：里程碑路线图 + 近期任务 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左侧：里程碑路线图 */}
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="font-medium text-sm mb-4">里程碑路线图</div>
          {upcomingMilestones.length === 0 ? (
            <div className="text-text-light text-sm">暂无进行中的里程碑</div>
          ) : (
            <div className="space-y-4">
              {upcomingMilestones.map((m, idx) => {
                const status = getMilestoneStatus(m.dueDate);
                return (
                  <div key={m.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${status.color} bg-white`}
                      />
                      {idx < upcomingMilestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-border" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{m.title}</div>
                      <div className="text-xs text-text-light font-mono">
                        {m.goalTitle} · {m.dueDate}
                      </div>
                      <span className={`text-xs font-mono ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 右侧：近期任务（本周，按日期分组） */}
        <div className="bg-surface border border-border rounded-md p-5">
          <div className="font-medium text-sm mb-4">近期任务（本周）</div>
          {weekTodoCount === 0 ? (
            <div className="text-text-light text-sm">本周暂无待办</div>
          ) : (
            <div className="space-y-3">
              {weekTodoMap.map((g) => (
                <div key={g.date}>
                  <div className="text-xs font-mono text-text-light mb-1">{g.label} · {g.date}</div>
                  <ul className="space-y-1">
                    {g.items.slice(0, 4).map((t) => (
                      <li key={t.id} className="flex items-center gap-2 text-sm border-b border-border/50 pb-1">
                        <input type="checkbox" className="w-4 h-4 accent-black" />
                        <span>{t.content}</span>
                      </li>
                    ))}
                    {g.items.length > 4 && (
                      <li className="text-xs text-text-light">+ 还有 {g.items.length - 4} 项</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 第三行：年度进度总览 */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="font-medium text-sm mb-4">年度进度总览</div>
        <div className="space-y-3">
          {goals.length === 0 ? (
            <div className="text-text-light text-sm">暂无年度目标</div>
          ) : (
            goals.map((g) => {
              const subDone = (g.subTasks || []).filter((s) => s.done).length;
              const subTotal = (g.subTasks || []).length;
              const mileDone = (g.milestones || []).filter((m) => m.done).length;
              const mileTotal = (g.milestones || []).length;
              const progress =
                subTotal + mileTotal === 0
                  ? 0
                  : Math.round(
                      ((subDone + mileDone) / (subTotal + mileTotal)) * 100
                    );
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm">
                    <span>{g.title}</span>
                    <span className="font-mono text-text-light">{progress}%</span>
                  </div>
                  <Progress value={progress} className="mt-1" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
