// src/components/TrainingSchedule.jsx
// 训练日程表：按周展示晨间/晚间训练，含 B站链接和打卡
import { MORNING, EVENING, useTrainingStore } from '../stores/training.slice';

const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 计算本周一到周日的日期
const getWeekDates = () => {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 周日=7
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const formatMD = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

const PlayLink = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="text-text-light hover:text-[var(--accent)] ml-1.5 inline-flex items-center"
    title="打开视频"
  >
    ▶
  </a>
);

export default function TrainingSchedule() {
  const { checkins, toggleCheckin } = useTrainingStore();
  const weekDates = getWeekDates();

  // 计算进度
  const totalSessions = 12; // 周一~周六，每天2个时段
  let doneCount = 0;
  for (let i = 0; i < 6; i++) {
    const dateStr = formatDate(weekDates[i]);
    if (checkins[`${dateStr}-morning`]) doneCount++;
    if (checkins[`${dateStr}-evening`]) doneCount++;
  }
  const pct = Math.round((doneCount / totalSessions) * 100);

  const renderDay = (date, label, idx) => {
    const dateStr = formatDate(date);
    const isSunday = idx === 6;

    if (isSunday) {
      return (
        <div key={dateStr} className="border border-border rounded-md p-3 bg-[var(--surface-2)] opacity-60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-text-secondary">{label} · {formatMD(date)}</span>
            <span className="text-xs text-text-light">休息日</span>
          </div>
          <p className="text-xs text-text-light">今日休息，不安排训练</p>
        </div>
      );
    }

    const morningDone = checkins[`${dateStr}-morning`] || false;
    const eveningDone = checkins[`${dateStr}-evening`] || false;

    return (
      <div key={dateStr} className="border border-border rounded-md p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono text-text-secondary">{label} · {formatMD(date)}</span>
        </div>

        {/* 晨间 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-text-light">晨间 7:00-8:00</span>
            <button
              onClick={() => toggleCheckin(dateStr, 'morning')}
              className={`text-xs px-2 py-0.5 rounded-sm border transition-all ${
                morningDone
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-text-secondary border-border hover:border-[var(--accent)]'
              }`}
            >
              {morningDone ? '已完成 ✓' : '打卡'}
            </button>
          </div>
          <ul className="space-y-1">
            {MORNING.map((item) => (
              <li key={item.id} className="text-xs text-text-secondary flex items-center">
                <span className="text-text-light font-mono w-10 flex-shrink-0">{item.time}</span>
                <span>{item.name}</span>
                <PlayLink url={item.url} />
              </li>
            ))}
          </ul>
        </div>

        {/* 晚间 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-text-light">晚间 20:30-22:00</span>
            <button
              onClick={() => toggleCheckin(dateStr, 'evening')}
              className={`text-xs px-2 py-0.5 rounded-sm border transition-all ${
                eveningDone
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-text-secondary border-border hover:border-[var(--accent)]'
              }`}
            >
              {eveningDone ? '已完成 ✓' : '打卡'}
            </button>
          </div>
          <ul className="space-y-1">
            {EVENING.map((item) => (
              <li key={item.id} className="text-xs text-text-secondary flex items-center">
                <span className="text-text-light font-mono w-10 flex-shrink-0">{item.time}</span>
                <span>{item.name}</span>
                <PlayLink url={item.url} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono text-text-secondary tracking-wide">训练日程表</h2>
        <span className={`text-xs font-mono ${pct === 100 ? 'text-black' : 'text-text-light'}`}>
          {doneCount}/{totalSessions}
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full h-1 bg-[var(--surface-2)] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {weekDates.map((date, idx) => renderDay(date, WEEK_LABELS[idx], idx))}
      </div>
    </section>
  );
}
