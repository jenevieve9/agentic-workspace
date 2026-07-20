# agentic-workspace

一个本地优先（local-first）的个人工作台 Web 应用：看板、年度/月度/周目标、每日 TODO、日记、思考积累、内容工坊、减肥修身、备婚等模块，数据全部存于浏览器 **localStorage**。

核心能力：
- **公网访问**：一键部署到 Vercel（绑定 GitHub 仓库，push 即更新）。
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

## 二、部署到公网（GitHub + Vercel）

### 2.1 推送到 GitHub
1. 在 GitHub 新建仓库，名称建议为 `agentic-workspace`（公开或私有均可）。
2. 在本项目根目录执行：
   ```bash
   git init
   git add .
   git commit -m "init agentic-workspace"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/agentic-workspace.git
   git push -u origin main
   ```
   （本仓库已 `git init` 并提交，可直接从 `git remote add` 开始。）

### 2.2 用 GitHub 登录 Vercel 导入仓库
1. 打开 [vercel.com](https://vercel.com)，用 **GitHub 账号** 登录。
2. 点击 **Add New → Project**，导入 `agentic-workspace` 仓库。
3. Vercel 会自动识别 Vite，构建配置保持默认即可：
   - **Framework Preset**：Vite
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
4. 点击 **Deploy**，等待构建完成，即可获得公网链接（如 `https://agentic-workspace.vercel.app`）。

### 2.3 自动部署
导入后 Vercel 默认已开启：**每次 push 到 `main` 分支，自动重新部署**。无需额外配置。

> 本项目使用 HashRouter（`/#/goals` 形式），因此 Vercel 不需要任何 SPA rewrite 规则，部署零额外配置。

### 2.4 环境变量（可选）
如需把 GitHub Token 固化进构建（仅适用于 **公开** 仓库，否则 Token 会暴露在前端代码中），可在 Vercel 项目 **Settings → Environment Variables** 添加：
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
