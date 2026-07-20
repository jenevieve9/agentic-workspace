// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      {/* 右侧主内容区，左边距留出侧边栏宽度 */}
      <main className="ml-[220px] flex-1 p-8 max-w-6xl min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
