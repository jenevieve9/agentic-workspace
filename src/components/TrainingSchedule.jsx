// src/components/TrainingSchedule.jsx
// 训练日程表：本周卡片 + 打卡 + 训练项目详情展开
import { useState } from 'react';
import { useTrainingStore } from '../stores/training.slice';

const TRAINING_PROGRAMS = {
  morning: [
    { id: 'belly1', label: '欧阳春晓沙漏', link: 'https://www.bilibili.com/video/BV1sv4y1h7MB/', duration: '20min' },
    { id: 'arm1', label: '刘板筋瘦手臂', link: 'https://www.bilibili.com/video/BV1juYmztEGr/', duration: '10min' },
    { id: 'pelvis', label: '骨盆回正', link: 'https://www.bilibili.com/video/BV14w411h7rj/', duration: '8min' },
    { id: 'shoulder2', label: '体态大师气场女王', link: 'https://www.bilibili.com/video/BV1q64y1u7Lc/', duration: '21min' },
    { id: 'meditation', label: '正念冥想', link: 'https://www.xiaohongshu.com/search_result/67c5b946000000000900c75c', duration: '15min' },
  ],
  evening: [
    { id: 'belly2', label: 'Elen fi腹部训练', link: 'https://www.bilibili.com/video/BV1pHqVBKEYj/', duration: '20min' },
    { id: 'stretch', label: 'Mady Morrison拉伸', link: 'https://www.bilibili.com/video/BV15V411a7cV/', duration: '17min' },
    { id: 'arm2', label: '欧阳春晓少女背', link: 'https://www.bilibili.com/video/BV1Ha4y147Sd/', duration: '15min' },
    { id: 'shoulder1', label: '日本体态大师', link: 'https://www.bilibili.com/video/BV1aL411Q7VN/', duration: '16min' },
    { id: 'cardio', label: 'JO姐有氧 5000步', link: 'https://www.bilibili.com/video/BV193411N7Ew/', duration: '30min' },
  ],
};

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + 1);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dayLabel = (d) => {
  const labels = ['一', '二', '三', '四', '五', '六', '日'];
  return labels[d.getDay() === 0 ? 6 : d.getDay() - 1];
};

export default function TrainingSchedule() {
  const { trainingLog, toggleTraining, getTrainingStatus } = useTrainingStore();
  const weekDates = getWeekDates();
  const todayStr = formatDate(new Date());

  const totalSessions = 12; // 周一~周六，每天2时段
  let completedSessions = 0;
  weekDates.forEach((d) => {
    const ds = formatDate(d);
    if (d.getDay() === 0) return;
    if (getTrainingStatus(ds, 'morning')) completedSessions++;
    if (getTrainingStatus(ds, 'evening')) completedSessions++;
  });
  const completionRate = Math.round((completedSessions / totalSessions) * 100);

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (dateStr, session) => {
    const key = `${dateStr}-${session}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExpanded = (dateStr, session) => {
    return expanded[`${dateStr}-${session}`] || dateStr === todayStr;
  };

  return (
    <div className="space-y-6">
      {/* 概览 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-text-secondary">本周训练完成率</div>
          <div className="text-2xl font-light tracking-tight">{completionRate}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-secondary">已完成</div>
          <div className="text-xl font-light tracking-tight">{completedSessions} / {totalSessions}</div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-1 w-full bg-border/60 rounded-full overflow-hidden">
        <div className="h-full bg-text-primary transition-all" style={{ width: `${completionRate}%` }} />
      </div>

      {/* 每日卡片（横向滚动） */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-4 min-w-max">
          {weekDates.map((d) => {
            const dateStr = formatDate(d);
            const isToday = dateStr === todayStr;
            const isRest = d.getDay() === 0;
            const morningDone = getTrainingStatus(dateStr, 'morning');
            const eveningDone = getTrainingStatus(dateStr, 'evening');

            return (
              <div
                key={dateStr}
                className={`flex-shrink-0 w-[280px] border rounded-lg p-4 transition-all ${
                  isToday ? 'border-text-primary bg-surface' : 'border-border/60 bg-surface/60'
                } ${isRest ? 'opacity-40' : ''}`}
              >
                {/* 日期头 */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium">周{dayLabel(d)}</span>
                    <span className="text-xs text-text-tertiary ml-2 font-mono">
                      {d.getMonth() + 1}/{d.getDate()}
                    </span>
                  </div>
                  {isRest ? (
                    <span className="text-xs text-text-tertiary font-mono">☕ 休息</span>
                  ) : (
                    <span className="text-xs text-text-tertiary font-mono">
                      {morningDone && eveningDone
                        ? '✅ 完成'
                        : `${(morningDone ? 1 : 0) + (eveningDone ? 1 : 0)}/2`}
                    </span>
                  )}
                </div>

                {!isRest && (
                  <div className="space-y-2">
                    {/* 晨间 */}
                    <div
                      className={`border rounded p-2 cursor-pointer transition-all ${
                        morningDone
                          ? 'bg-text-primary/5 border-text-primary/30'
                          : 'border-border/40'
                      }`}
                      onClick={() => toggleTraining(dateStr, 'morning')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-secondary">🌅 晨</span>
                        <span className="text-[10px] text-text-tertiary">
                          {morningDone ? '已完成 ✓' : '点击打卡'}
                        </span>
                      </div>
                      {isExpanded(dateStr, 'morning') && (
                        <div className="mt-2 space-y-0.5 text-xs text-text-secondary">
                          {TRAINING_PROGRAMS.morning.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 py-0.5">
                              <span>•</span>
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-text-primary hover:underline truncate"
                              >
                                {p.label}
                              </a>
                              <span className="text-text-tertiary ml-auto">{p.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 晚间 */}
                    <div
                      className={`border rounded p-2 cursor-pointer transition-all ${
                        eveningDone
                          ? 'bg-text-primary/5 border-text-primary/30'
                          : 'border-border/40'
                      }`}
                      onClick={() => toggleTraining(dateStr, 'evening')}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-secondary">🌙 晚</span>
                        <span className="text-[10px] text-text-tertiary">
                          {eveningDone ? '已完成 ✓' : '点击打卡'}
                        </span>
                      </div>
                      {isExpanded(dateStr, 'evening') && (
                        <div className="mt-2 space-y-0.5 text-xs text-text-secondary">
                          {TRAINING_PROGRAMS.evening.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 py-0.5">
                              <span>•</span>
                              <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-text-primary hover:underline truncate"
                              >
                                {p.label}
                              </a>
                              <span className="text-text-tertiary ml-auto">{p.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
