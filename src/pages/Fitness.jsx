// src/pages/Fitness.jsx
import { useFitnessStore } from '../stores/fitness.slice';
import Editable from '../components/Editable';
import PageTitle from '../components/PageTitle';
import Progress from '../components/Progress';
import TrainingSchedule from '../components/TrainingSchedule';
import { Link } from 'react-router-dom';

const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function Fitness() {
  const {
    fitness56, meals, meditation, sleep,
    toggleDay, toggleMeal, toggleMeditation, toggleSleep,
    phases, exercises, diet,
    updatePhase, addPhase, removePhase,
    addExercise, updateExercise, removeExercise,
    updateDiet, updateDietNote,
  } = useFitnessStore();

  const totalDays = 56;
  const doneDays = Object.values(fitness56).filter((v) => v === true).length;
  const percent = Math.round((doneDays / totalDays) * 100);

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
  const weekDates = getWeekDates();
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const renderGrid = () => {
    const startDate = new Date(2026, 6, 21); // 7月21日（JS月份从0开始）
    const today = new Date();
    const days = [];
    for (let i = 0; i < 56; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days.map((d) => {
      const key = dateKey(d);
      const active = fitness56[key] || false;
      const isToday = key === dateKey(today);
      return (
        <div
          key={key}
          onClick={() => toggleDay(key)}
          title={key}
          className={`aspect-square rounded-sm border text-xs flex items-center justify-center cursor-pointer transition-all
            ${active ? 'bg-black text-white border-[var(--accent)]' : 'bg-white border-border hover:border-[var(--accent)]'}
            ${isToday ? 'border-2 border-[var(--accent)]' : ''}
          `}
        >
          {d.getDate()}
        </div>
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      {/* 头部 */}
      <PageTitle
        pageKey="fitness"
        subtitle="7.21 – 9.14 · 56天挑战"
        right={
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 border border-border rounded-full text-sm font-mono">{percent}%</span>
            <Link to="/wedding" className="px-3 py-1.5 border border-[var(--accent)] rounded-sm text-sm hover:bg-black hover:text-white transition">
              联动备婚
            </Link>
          </div>
        }
      />

      {/* 进度条 */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>已打卡 <strong>{doneDays}</strong> 天</span>
          <span>目标 <strong>56</strong> 天</span>
        </div>
        <Progress value={percent} />
      </div>

      {/* 阶段目标（月度安排） */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono text-text-secondary tracking-wide">阶段目标 · 月度安排</h2>
          <button
            className="text-xs text-text-light hover:text-[var(--accent)]"
            onClick={() => addPhase({ period: '新增月', title: '目标内容', target: '→ 体重' })}
          >
            + 阶段
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((p) => (
            <div key={p.id} className="bg-[var(--surface-2)] border border-border rounded-md p-4 group">
              <div className="flex items-start justify-between">
                <Editable as="div" value={p.period} onCommit={(v) => updatePhase(p.id, { period: v })} className="text-xs font-mono text-text-light outline-none focus:ring-1 focus:ring-black rounded px-1" />
                <button className="text-text-light hover:text-[var(--accent)] text-xs opacity-0 group-hover:opacity-100" onClick={() => removePhase(p.id)}>删除</button>
              </div>
              <Editable as="div" value={p.title} onCommit={(v) => updatePhase(p.id, { title: v })} className="text-sm font-medium outline-none focus:ring-1 focus:ring-black rounded px-1 mt-1" />
              <Editable as="div" value={p.target} onCommit={(v) => updatePhase(p.id, { target: v })} className="text-xs text-text-secondary outline-none focus:ring-1 focus:ring-black rounded px-1 mt-1" />
            </div>
          ))}
        </div>
      </section>

      {/* 训练日程表 */}
      <div className="bg-surface border border-border/60 rounded-lg p-5">
        <h2 className="text-base font-light tracking-wide mb-4">训练日程表</h2>
        <TrainingSchedule />
      </div>

      {/* 训练计划 */}
      <section>
        <h2 className="text-sm font-mono text-text-secondary tracking-wide mb-1">训练计划</h2>
        <p className="text-xs text-text-light mb-3">
          晨 7-8：肚子1 + 手臂1 + 骨盆回正 + 肩膀内扣2 + 冥想 ｜ 晚 20:30-22:00：肚子2 + 拉伸 + 手臂2 + 骨盆回正 + 肩膀内扣1 + 有氧
        </p>
        <div className="space-y-4">
          {Object.entries(exercises).map(([cat, list]) => (
            <div key={cat} className="bg-surface border border-border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{cat}</div>
                <button
                  className="text-xs text-text-light hover:text-[var(--accent)]"
                  onClick={() => addExercise(cat, { name: '新动作', url: '', note: '' })}
                >
                  + 动作
                </button>
              </div>
              <div className="divide-y divide-border/60">
                {list.map((ex) => (
                  <div key={ex.id} className="group py-2 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <Editable as="div" value={ex.name} onCommit={(v) => updateExercise(cat, ex.id, { name: v })} className="text-sm outline-none focus:ring-1 focus:ring-black rounded px-1" />
                      <div className="flex items-center gap-2 mt-0.5">
                        {ex.url ? (
                          <a href={ex.url} target="_blank" rel="noreferrer" className="text-xs text-text-light underline hover:text-[var(--accent)] truncate">链接</a>
                        ) : (
                          <span className="text-xs text-text-light">无链接</span>
                        )}
                        <Editable as="div" value={ex.note} onCommit={(v) => updateExercise(cat, ex.id, { note: v })} placeholder="备注" className="text-xs text-text-secondary outline-none focus:ring-1 focus:ring-black rounded px-1" />
                      </div>
                    </div>
                    <button className="text-text-light hover:text-[var(--accent)] text-xs opacity-0 group-hover:opacity-100" onClick={() => removeExercise(cat, ex.id)}>删除</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 纯净餐食 */}
      <section>
        <h2 className="text-sm font-mono text-text-secondary tracking-wide mb-3">本周纯净餐食</h2>
        <div className="border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-2)] text-text-secondary text-xs font-mono">
                <tr>
                  <th className="p-3 text-left w-16">日</th>
                  <th className="p-3 text-left">早餐</th>
                  <th className="p-3 text-left">午餐</th>
                  <th className="p-3 text-left">晚餐</th>
                  <th className="p-3 text-center w-16">✓</th>
                </tr>
              </thead>
              <tbody>
                {WEEK_DAYS.map((day, idx) => {
                  const dateStr = weekDates[idx] ? dateKey(weekDates[idx]) : day;
                  const dayMeals = meals[dateStr] || {};
                  return (
                    <tr key={day} className="border-t border-border">
                      <td className="p-3 font-mono text-text-light text-xs">{day}</td>
                      <Editable as="td" value={diet.breakfast?.[day] || ''} onCommit={(v) => updateDiet('breakfast', day, v)} className="p-3 outline-none focus:ring-1 focus:ring-black rounded" />
                      <Editable as="td" value={diet.lunch?.[day] || ''} onCommit={(v) => updateDiet('lunch', day, v)} className="p-3 outline-none focus:ring-1 focus:ring-black rounded" />
                      <Editable as="td" value={diet.dinner?.[day] || ''} onCommit={(v) => updateDiet('dinner', day, v)} className="p-3 outline-none focus:ring-1 focus:ring-black rounded" />
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={dayMeals.checked || false}
                          onChange={() => toggleMeal(dateStr, 'checked')}
                          className="w-4 h-4 accent-black"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--surface-2)] border border-border rounded-md p-4">
            <div className="text-xs font-mono text-text-light mb-1">加餐</div>
            <Editable as="div" value={diet.snack || ''} onCommit={(v) => updateDietNote('snack', v)} className="text-sm outline-none focus:ring-1 focus:ring-black rounded px-1" />
          </div>
          <div className="bg-[var(--surface-2)] border border-border rounded-md p-4">
            <div className="text-xs font-mono text-text-light mb-1">饮水</div>
            <Editable as="div" value={diet.water || ''} onCommit={(v) => updateDietNote('water', v)} className="text-sm outline-none focus:ring-1 focus:ring-black rounded px-1" />
          </div>
          <div className="bg-[var(--surface-2)] border border-border rounded-md p-4">
            <div className="text-xs font-mono text-text-light mb-1">戒除项</div>
            <Editable as="div" value={diet.avoid || ''} onCommit={(v) => updateDietNote('avoid', v)} className="text-sm outline-none focus:ring-1 focus:ring-black rounded px-1" />
          </div>
        </div>
      </section>

      {/* 正念 · 作息 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-md p-4">
          <div className="font-medium text-sm mb-1">正念冥想 · 15min（驱散脑雾）</div>
          <a href="https://www.xiaohongshu.com/search_result/67c5b946000000000900c75c" target="_blank" rel="noreferrer" className="text-xs text-text-light underline hover:text-[var(--accent)]">参考引导</a>
          <div className="flex flex-wrap gap-2 mt-3">
            {WEEK_DAYS.map((day) => {
              const dateStr = weekDates[WEEK_DAYS.indexOf(day)] ? dateKey(weekDates[WEEK_DAYS.indexOf(day)]) : day;
              const active = meditation[dateStr] || false;
              return (
                <button
                  key={day}
                  onClick={() => toggleMeditation(dateStr)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${active ? 'bg-black text-white border-[var(--accent)]' : 'bg-white border-border text-text-secondary'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border border-border rounded-md p-4">
          <div className="font-medium text-sm mb-1">23:00 早睡 · 睡前涂养发液</div>
          <div className="text-xs text-text-secondary">规律作息，养发同步进行</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {WEEK_DAYS.map((day) => {
              const dateStr = weekDates[WEEK_DAYS.indexOf(day)] ? dateKey(weekDates[WEEK_DAYS.indexOf(day)]) : day;
              const active = sleep[dateStr] || false;
              return (
                <button
                  key={day}
                  onClick={() => toggleSleep(dateStr)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${active ? 'bg-black text-white border-[var(--accent)]' : 'bg-white border-border text-text-secondary'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 56天打卡日历 */}
      <section className="border border-border rounded-md p-4">
        <div className="font-medium text-sm mb-3">56天打卡日历</div>
        <div className="grid grid-cols-7 sm:grid-cols-7 gap-1.5">
          {renderGrid()}
        </div>
      </section>
    </div>
  );
}
