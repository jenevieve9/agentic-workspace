# agentic-workspace

一个本地优先（local-first）的个人工作台 Web 应用：看板、年度/月度/周目标、每日 TODO、日记、思考积累、内容工坊、减肥修身、备婚等模块，数据全部存于浏览器 **localStorage**。

核心能力：
- **公网访问**：部署到 GitHub Pages（绑定 GitHub 仓库，免账号验证）；也可改用 Vercel（需账号通过验证）。
- **跨设备同步**：通过 GitHub Gist 把全部本地数据带走，换设备一键拉取还原。
- **Obsidian 联动**：日记 / 思考可一键唤起或写入 Obsidian 笔记，配套提供开箱即用的 Obsidian 模板库。

---

## 一、本地运行

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 生产构建，产物在 dist/
npm run preview    # 预览构建产物
```

> 技术栈：Vite + React 19 + React Router 7（HashRouter，无需服务端 rewrite）+ Tailwind CSS 3 + Zustand 5（persist → localStorage）。

---

## 二、部署到公网（GitHub Pages，免账号验证）

> 说明：Vercel 对新账号有强制验证墙（"Your account requires further verification"），需本人提交 account recovery 表单等待审核。为不阻塞上线，本仓库默认采用 **GitHub Pages**——你已有可用的 GitHub 账号，无需任何额外验证。

### 2.1 推送到 GitHub（已完成）
本仓库已 `git init` 并提交：源码在 `main` 分支，构建产物已推送到 `gh-pages` 分支。

### 2.2 在 GitHub 启用 Pages（你只需点一下）
1. 打开仓库 `agentic-workspace` → **Settings → Pages**。
2. **Source** 选择 **Deploy from a branch**。
3. **Branch** 选 **gh-pages**，目录选 **/(root)**，点 **Save**。
4. 约 1 分钟后访问：`https://<你的用户名>.github.io/agentic-workspace/`

### 2.3 后续更新部署
当前为「手动构建 → 推 gh-pages 分支」方式。代码改动后需重新构建并把 `dist/` 内容推到 `gh-pages` 分支（仓库 `.github/` 下有说明）。

### 2.4 想用 Vercel？（可选）
等 Vercel 账号通过验证后，用 GitHub 登录 [vercel.com](https://vercel.com) → Import 本仓库即可；Vite 默认配置、无需 rewrite（HashRouter）。
> 注意：若改用 Vercel，建议删除仓库里的 `.github/workflows/deploy.yml`（它走 GitHub Actions 部署，与分支方式冲突），或直接以 Vercel 为准。

> 本项目使用 HashRouter（`/#/goals` 形式）+ `base:'./'` 相对路径，因此在任意静态托管（GitHub Pages / Vercel / Netlify / Cloudflare Pages）都无需任何 SPA rewrite 规则，部署零额外配置。

### 2.5 环境变量（可选）
如需把 GitHub Token 固化进构建（仅适用于 **公开** 仓库，否则 Token 会暴露在前端代码中），可在托管平台的环境变量里添加：
```
VITE_GITHUB_TOKEN=你的token
```
**推荐**做法：不配置环境变量，直接在应用「系统联动」页面手动粘贴 Token，更私密安全。

---

## 三、跨设备数据同步（GitHub Gist）

数据存于浏览器本地，换设备/清缓存会丢失。用 GitHub Gist 即可「带走」数据：

1. 打开 GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**。
2. 生成 token，勾选 **gist** 权限，复制。
3. 在应用「系统联动」页，把 token 粘贴到 **GitHub 同步** 输入框。
4. 点 **同步到 Gist** → 数据上传到你的私有 Gist（首次自动创建）。
5. 换设备打开同一链接 → 点 **从 Gist 拉取** → 数据还原。

> Token 仅保存在本机 localStorage，不会上传到任何服务器（除 GitHub 官方 Gist API 外）。

---

## 四、Obsidian 联动

### 4.1 下载模板库
在「系统联动」页点击 **下载 Obsidian 模板库**，得到 `obsidian-vault-template.zip`。解压后用 Obsidian 打开该文件夹作为仓库（仓库名建议设为 **Main**，需与 Web 端「Obsidian 联动」中填写的仓库名一致）。

模板库结构：
```
你的 Vault 根目录/
├── 01_Daily/2026/07/      # 日记（按 年/月 归档）
├── 02_Reflections/         # 深度思考文章（输出）
│   ├── 职场/
│   ├── AI创业/
│   └── 个人成长/
├── 03_Thoughts/            # 思考积累（与 Web 端分类对应）
│   ├── 人生思考/
│   ├── AI公众号文章/
│   ├── AI工具积累/
│   └── 职场晋升/
├── 04_Templates/           # 模板
│   ├── Daily.md
│   └── Reflection.md
└── .obsidian/              # 插件配置（已内置）
    ├── community-plugins.json
    └── plugins.json
```

### 4.2 安装插件
模板库已内置插件配置，首次打开 Obsidian 会提示启用以下社区插件（在「设置 → 第三方插件」中安装并启用）：
- **Templater**（模板目录已指向 `04_Templates`）
- **Dataview**
- **Calendar**
- **Style Settings**
- **Local REST API**（端口 27123，可选，用于静默写入）

### 4.3 在 Web 端配置
「系统联动」页的 **Obsidian 联动** 区块：
- **仓库名**：填 `Main`（或你的实际仓库名）。
- **Local REST API Key**（可选）：在 Obsidian 的 Local REST API 插件中生成 Bearer Token 后填入；启用后「写日记」走静默 API，否则走 `obsidian://` 弹窗唤起。

### 4.4 使用
- **日记页**：点右上角「在 Obsidian 中写日记」新建今日日记；日记索引中「打开」跳转对应笔记，「同步」用当前内容新建/覆盖笔记。
- **思考页**：每条思考下方「同步 Obsidian」即按 `思考_日期` 创建笔记。

> 说明：Obsidian 是本地应用，`obsidian://` 与 Local REST API 都要求 **浏览器与 Obsidian 在同一台机器**。纯远程网站无法直连 Obsidian，需本机常驻代理（超出纯前端范围，相关接口已预留）。

---

## 五、目录结构

```
agentic-workspace/
├── public/
│   └── obsidian-vault-template.zip   # Obsidian 模板库（可直接下载）
├── src/
│   ├── components/                    # PageTitle / Progress / Tag / Button / Editable / layout
│   ├── pages/                         # 各功能页面
│   ├── stores/                        # Zustand 状态（*.slice.js，persist → localStorage）
│   ├── services/                      # storage / github / obsidian 服务
│   ├── routes/                        # 路由（HashRouter）
│   ├── index.css                      # 单一清爽主题（CSS 变量）
│   └── main.jsx
├── vite.config.js                     # base: './'，可部署到任意子路径/端口
└── package.json
```
