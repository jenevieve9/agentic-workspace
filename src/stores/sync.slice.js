// src/stores/sync.slice.js
// 跨设备同步配置：GitHub Gist（Token 与 Gist id 仅存本地）
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSyncStore = create(
  persist(
    (set) => ({
      gistToken: '',
      gistId: '',                                   // 已创建的同步 Gist id
      gistFilename: 'agentic-workspace-data.json',
      setGistConfig: (cfg) => set((s) => ({ ...s, ...cfg })),
    }),
    { name: 'sync-storage' }
  )
);
