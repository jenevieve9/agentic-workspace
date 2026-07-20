// src/stores/obsidian.slice.js
// Obsidian 联动配置：仓库名 + 可选 Local REST API（密钥仅在本地 localStorage）
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useObsidianStore = create(
  persist(
    (set) => ({
      vault: 'Main',          // Obsidian 仓库名（设置 → 关于 → 仓库名）
      restEnabled: false,     // 是否启用 Local REST API
      apiKey: '',             // Local REST API 插件生成的 Bearer Token
      setObsidianConfig: (cfg) => set((s) => ({ ...s, ...cfg })),
    }),
    { name: 'obsidian-storage' }
  )
);
