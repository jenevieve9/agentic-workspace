// src/routes/index.jsx
import { lazy, Suspense } from 'react';
import { createHashRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// ===== 所有页面使用懒加载（按需加载，不会一次性全部下载） =====
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Fitness = lazy(() => import('../pages/Fitness'));
const Wedding = lazy(() => import('../pages/Wedding'));
const Diary = lazy(() => import('../pages/Diary'));
const Goals = lazy(() => import('../pages/Goals'));
const Monthly = lazy(() => import('../pages/Monthly'));
const Weekly = lazy(() => import('../pages/Weekly'));
const Todo = lazy(() => import('../pages/Todo'));
const Thoughts = lazy(() => import('../pages/Thoughts'));
const ContentStudio = lazy(() => import('../pages/ContentStudio'));
const Settings = lazy(() => import('../pages/Settings'));

// 加载中的占位组件
const Loading = () => (
  <div className="flex items-center justify-center h-48 text-text-secondary text-sm">
    加载中...
  </div>
);

// ===== 路由定义 =====
export const router = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><Dashboard /></Suspense> },
      { path: 'fitness', element: <Suspense fallback={<Loading />}><Fitness /></Suspense> },
      { path: 'wedding', element: <Suspense fallback={<Loading />}><Wedding /></Suspense> },
      { path: 'diary', element: <Suspense fallback={<Loading />}><Diary /></Suspense> },
      { path: 'goals', element: <Suspense fallback={<Loading />}><Goals /></Suspense> },
      { path: 'monthly', element: <Suspense fallback={<Loading />}><Monthly /></Suspense> },
      { path: 'weekly', element: <Suspense fallback={<Loading />}><Weekly /></Suspense> },
      { path: 'todo', element: <Suspense fallback={<Loading />}><Todo /></Suspense> },
      { path: 'thoughts', element: <Suspense fallback={<Loading />}><Thoughts /></Suspense> },
      { path: 'content-studio', element: <Suspense fallback={<Loading />}><ContentStudio /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Loading />}><Settings /></Suspense> },
    ],
  },
]);
