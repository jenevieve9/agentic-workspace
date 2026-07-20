// src/pages/Wedding.jsx
// Notion 风格的备婚页：极简留白、白卡浅灰分割、字号字重区分层级。
// 数据为 my-wedding 真实镜像；底部内嵌原站 + 新窗口跳转按钮。
import { useWeddingData } from '../stores/weddingData.slice';

/* 章节小标题（Notion 风格：小号灰字，不用颜色区分） */
function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-medium text-secondary">{title}</h2>
      {children}
    </section>
  );
}

/* 可视化里程碑路线：横向连线 + 节点，已完成按日期自动判定 */
function MilestoneRoute({ milestones }) {
  const now = new Date();
  const isDone = (md) => {
    const [m, d] = md.split('.').map(Number);
    return new Date(2026, m - 1, d) <= now;
  };
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px] py-2">
        <div className="flex">
          {milestones.map((m, i) => {
            const done = isDone(m.date);
            const isFirst = i === 0;
            const isLast = i === milestones.length - 1;
            return (
              <div key={i} className="relative flex flex-1 flex-col items-center text-center">
                {!isFirst && (
                  <span className="absolute left-0 right-1/2 top-[7px] h-px bg-border" />
                )}
                {!isLast && (
                  <span className="absolute left-1/2 right-0 top-[7px] h-px bg-border" />
                )}
                <span
                  className={`z-10 h-3.5 w-3.5 rounded-full border-2 ${
                    done ? 'border-accent bg-accent' : 'border-border bg-white'
                  }`}
                />
                <span className="mt-3 font-mono text-[11px] text-light">{m.date}</span>
                <span
                  className={`mt-1 max-w-[92px] text-xs leading-snug ${
                    done ? 'text-secondary line-through' : 'text-main'
                  }`}
                >
                  {m.event}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Wedding() {
  const { header, weeklyFocus, categories, dietData, licenseData, milestones, toggleTask } =
    useWeddingData();

  const total = categories.reduce((a, c) => a + c.items.length, 0);
  const done = categories.reduce((a, c) => a + c.items.filter((i) => i.done).length, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-10">
      {/* 头部：标题 + 日期 + 跳转按钮 */}
      <header className="border-b border-border pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-main">{header.title}</h1>
            <div className="mt-2 text-sm text-light">{header.sub}</div>
          </div>
          <a
            href={header.source}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-md border border-border px-4 py-2 text-sm text-secondary transition hover:bg-surface-2 hover:text-main"
          >
            打开完整备婚页 ↗
          </a>
        </div>
      </header>

      {/* 总完成率卡片 */}
      <section>
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm text-secondary">备婚总完成率</div>
              <div className="text-4xl font-light tracking-tight text-main">{pct}%</div>
              <div className="mt-1 text-xs text-light">
                {done} / {total} 项已落实
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary">启动</div>
              <div className="font-mono text-lg text-secondary">2026.07.15</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary">婚礼正宴</div>
              <div className="font-mono text-lg text-secondary">2026.10.03</div>
            </div>
          </div>
          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </section>

      {/* 可视化里程碑路线 */}
      <Section title="📍 里程碑路线">
        <div className="rounded-lg border border-border bg-surface p-5">
          <MilestoneRoute milestones={milestones} />
        </div>
      </Section>

      {/* 本周重点关注 */}
      <Section title="📌 本周重点关注 / Weekly Highlights">
        <div className="flex flex-wrap gap-2">
          {weeklyFocus.map((f) => (
            <span
              key={f.id}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-main"
            >
              {f.text}
              {f.desc && <span className="ml-2 text-xs text-light">{f.desc}</span>}
            </span>
          ))}
        </div>
      </Section>

      {/* 备婚大类进程卡片 */}
      <Section title="📂 备婚大类进程">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border border-border bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-secondary">
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </h3>
              <div className="space-y-2.5">
                {cat.items.map((it) => (
                  <label key={it.id} className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={it.done}
                      onChange={() => toggleTask(cat.id, it.id)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm accent-[var(--accent)]"
                    />
                    <span className="flex-1">
                      <span className={it.done ? 'text-light line-through' : 'text-main'}>
                        {it.title}
                      </span>
                      {it.meta && (
                        <span className="mt-0.5 block text-xs text-light">{it.meta}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 身体美学 · 100日轻盈计划 */}
      <Section title="🥗 身体美学 · 100日轻盈计划">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary">
              当前 <span className="font-mono text-main">{header.weightStart}</span> 斤 → 目标{' '}
              <span className="font-mono text-main">{header.weightTarget}</span> 斤
            </div>
            <div className="text-xs text-light">计划启动中</div>
          </div>
          <div className="relative mt-4 h-1 w-full rounded-full bg-border">
            <span
              className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-accent bg-white"
              title="目标 100 斤"
            />
            <span
              className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent"
              title="当前 126 斤"
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-light">
            <span>目标 100 斤</span>
            <span>当前 126 斤</span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-xs font-normal text-light">
                  <th className="py-2 pr-4 font-normal">日</th>
                  <th className="py-2 pr-4 font-normal">运动</th>
                  <th className="py-2 font-normal">餐单</th>
                </tr>
              </thead>
              <tbody>
                {dietData.map((d) => (
                  <tr key={d.day} className="border-t border-border">
                    <td className="py-2 pr-4 font-mono text-xs text-light">{d.day}</td>
                    <td className="py-2 pr-4 text-main">{d.workout}</td>
                    <td className="py-2 text-secondary">{d.food}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* 独立旅程 · 驾驶许可证路线 */}
      <Section title="🏁 独立旅程 · 驾驶许可证路线">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="space-y-4">
            {licenseData.map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <div>
                  <div className="font-mono text-xs text-light">{l.date}</div>
                  <div className="text-sm text-main">{l.task}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 内嵌原站 + 跳转 */}
      <Section title="🔗 完整备婚看板">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-sm font-medium text-secondary">my-wedding · 渐变毛玻璃画册版</span>
            <a
              href={header.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary underline hover:text-main"
            >
              在新窗口打开 ↗
            </a>
          </div>
          <iframe
            src={header.source}
            title="备婚看板"
            className="w-full border-0"
            style={{ height: '72vh', minHeight: '520px' }}
          />
        </div>
      </Section>
    </div>
  );
}
