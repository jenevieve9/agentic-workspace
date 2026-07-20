# 日记 × Obsidian 联动路线图

> 定位：日记板块是「输出」，思考积累是「输入」。两者通过 Obsidian 的双向链接（[[]]）串成知识闭环。
> 当前 web 端已支持点击「在 Obsidian 中写日记」唤起 `obsidian://` 协议；本文档梳理从基础联动到商业化的四阶段路径。

---

## 一、Obsidian 库结构（建议）

```
Vault: Main
├── 00_Inbox/            # 临时想法，随时速记
├── 01_Daily/            # 日记（按 年/月 组织）
│   └── 2026/07/2026-07-19.md
├── 02_Reflections/      # 深度思考文章（输出）
│   ├── 职场/
│   ├── AI创业/
│   └── 个人成长/
├── 03_Thoughts/         # 思考积累（输入，与 web 端分类对应）
│   ├── 人生思考/
│   ├── AI工具积累/
│   └── 职场晋升/
├── 04_Templates/        # 模板
│   ├── Daily.md
│   └── Reflection.md
└── 05_Assets/           # 图片 / 附件
```

## 二、模板

### 日记模板（Daily.md）
```markdown
# {{date:YYYY-MM-DD}} · {{day:dddd}}

## 今日状态
- 情绪评分：___/10
- 精力评分：___/10
- 睡眠时长：___h

## 关键事件
-

## 思考输出
-

## 明日聚焦
-
```

### 思考文章模板（Reflection.md）
```markdown
# 标题

## 核心观点
-

## 论证 / 案例
-

## 延伸联想
-

## 关联思考积累
- [[03_Thoughts/xxx]]

## 下一步行动
-
```

## 三、API 生成方式

| 方案 | 能力 | 适用阶段 |
| --- | --- | --- |
| `obsidian://new` URL Scheme | 仅「创建」笔记，带 vault/name/content 参数 | 阶段一（够用） |
| **Local REST API** 插件 | 可读写、查询、列表，HTTP `localhost:27123` | 阶段二起 |

Local REST API 配置：
1. 社区插件市场安装 `Local REST API`；
2. 设置端口（默认 27123）与 API Key；
3. web 端用 `fetch('http://localhost:27123/vault/...', { headers: { Authorization: 'Bearer <key>' } })` 读写笔记；
4. 注意：仅本机有效，发布到公网需自建中间层。

## 四、推荐插件

- **Templater**：模板自动填充日期/变量
- **Dataview**：日记/思考汇总查询（如"本周写了几篇"）
- **Local REST API**：外部联动
- **Smart Connections**：本地语义检索，关联相似思考
- 阶段二手帐装修：**Style Settings / Minimal Theme / Hider / Calendar / Tracker / Excalidraw**

## 五、四阶段路径

### 阶段一 · 联动 Obsidian + AI 工具（流程跑通）
- Obsidian 搭建上述库结构 + 两个模板；
- web 端「写日记」唤起 `obsidian://`；
- AI 工具（如 DeepSeek）做润色 / 扩写 / 提炼观点；
- 思考积累分类归档 → 一键生成 Obsidian 笔记；
- 日记中「关联思考积累」字段手填 `[[03_Thoughts/xxx]]`。

### 阶段二 · Obsidian 手帐装修 + UI 设计
- CSS 片段：思源宋体 + 纸张纹理 + 手绘虚线边框；
- 用 Calendar/Tracker 做手帐式打卡；
- 与 Codex / Pandoc 联动，导出手帐风格 PDF/HTML。

### 阶段三 · 沉淀 SOP + 视频内容
- 把配置/工作流/自动化脚本沉淀为 SOP 文档；
- 视频四集：从零搭手帐系统 → AI 辅助写作 → 自动化生产 → 商业化变现。

### 阶段四 · 个人内容网站（Dankoe 风格）
- 技术：Next.js + Tailwind + Framer Motion，内容经 REST API 同步入库；
- GitHub Actions 定时构建；
- 模块：文章流 / 分类归档 / 全文检索 / 付费订阅；
- 商业化：付费深度内容 + 模板下载 + 个人知识管理陪跑。

## 六、前置思考（你的提醒）
先有一份**商业化路线与思考**（你已放在飞书文档，自己粘贴），再据此推进分阶段优化——避免为了做而做，每一步都服务于最终变现与影响力目标。
