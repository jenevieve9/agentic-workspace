// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '看板', icon: '◱' },
  { path: '/goals', label: '年度目标', icon: '◈' },
  { path: '/monthly', label: '月度目标', icon: '◫' },
  { path: '/weekly', label: '周计划', icon: '⊟' },
  { path: '/todo', label: '每日TODO', icon: '✓' },
  { path: '/diary', label: '日记', icon: '✎' },
  { path: '/thoughts', label: '思考积累', icon: '◉' },
  { path: '/content-studio', label: '内容工坊', icon: '✺' },
  { path: '/fitness', label: '减肥修身', icon: '◆' },
  { path: '/wedding', label: '备婚', icon: '♢' },
  { path: '/settings', label: '系统联动', icon: '⌗' },
];

export default function Sidebar() {
  return (
    <aside className="w-[220px] bg-surface border-r border-border fixed top-0 left-0 bottom-0 z-50 p-5 overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="text-base font-semibold tracking-tight flex items-center gap-2 pb-6 border-b border-border/60">
        <span className="block w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-b-text-main border-l-transparent border-r-transparent" />
        <span>Workspace</span>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 flex flex-col gap-0.5 mt-4">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                isActive
                  ? 'bg-[var(--surface-2)] text-text-main font-semibold'
                  : 'text-text-secondary hover:bg-[var(--surface-2)] hover:text-text-main'
              }`
            }
          >
            <span className="text-base w-5 text-center opacity-70">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 底部标识 */}
      <div className="pt-4 border-t border-border/60 font-mono text-[0.6rem] text-text-light">
        LOCAL · 2026
      </div>
    </aside>
  );
}
