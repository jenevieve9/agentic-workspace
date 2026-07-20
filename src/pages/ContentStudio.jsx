// src/pages/ContentStudio.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentStore } from '../stores/content.slice';
import PageTitle from '../components/PageTitle';
import Tag from '../components/Tag';
import Button from '../components/Button';

export default function ContentStudio() {
  const { contents, addContent, deleteContent } = useContentStore();
  const location = useLocation();

  // 从「思考积累」点击「生成内容」跳转而来时，预填主题
  useEffect(() => {
    if (location.state?.topic) setTopic(location.state.topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('公众号');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 排版状态
  const [rawText, setRawText] = useState('');
  const [formatPlatform, setFormatPlatform] = useState('公众号');
  const [formattedText, setFormattedText] = useState('');

  // 模拟AI生成：基于主题+平台拼接更真实的文案
  const generateDraft = () => {
    if (!topic.trim()) {
      alert('请输入主题或灵感');
      return;
    }
    setIsGenerating(true);
    setDraft('');

    const t = topic.trim();

    const generators = {
      '公众号': () => {
        const angles = [
          `最近一直在思考「${t}」这件事。`,
          `关于${t}，我经历了 3 个阶段的认知变化。`,
          `今天想和你聊一个很多人都在问的问题：${t}。`,
        ];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        return `${angle}

先说结论：真正能把 ${t} 做出结果的人，往往不是最努力的，而是最会抓杠杆的。

一、看清本质：${t} 不是单点问题，而是系统问题。你需要把目标拆成可执行的模块，而不是堆时间。

二、找对工具：AI 时代，很多重复劳动完全可以被工具替代。把省下来的时间投入到判断和创意上，回报率会高很多。

三、持续迭代：先完成，再完美。做出最小可行版本，拿到反馈，再逐步优化。

下一步行动：
1. 用 30 分钟把当前项目拆成 3 个模块；
2. 为每个模块找到一款合适的 AI 工具；
3. 本周内跑通一个最小闭环，记录数据。

如果你也在做 ${t}，欢迎在评论区分享你的进展，一起迭代。

#${t} #AI工具 #效率提升 #内容策略`;
      },
      '抖音口播': () => {
        return `大家好，今天我们来聊聊 ${t}。

我先说一个反常识的观点：做 ${t}，最忌讳的其实就是“太努力”。

为什么呢？因为 ${t} 的核心不是堆时间，而是找杠杆。

第一，你要把大目标拆成小模块，每个模块只解决一个具体问题；
第二，善用 AI 工具，把重复工作交给机器，你只做判断；
第三，先跑通最小闭环，拿到真实反馈，再快速迭代。

你卡在 ${t} 的哪一步？评论区告诉我，下期我来拆解。#${t}`;
      },
      '小红书笔记': () => {
        const bodies = [
          `1️⃣ 先搞清本质：${t} 不是单点问题，要拆成模块逐个解决；\n2️⃣ 善用工具：把重复工作交给 AI，自己只做决策；\n3️⃣ 快速迭代：先跑最小闭环，再优化。`,
          `✅ 第一步：把 ${t} 的目标拆成 3 个可执行模块；\n✅ 第二步：为每个模块匹配一款 AI 工具；\n✅ 第三步：本周内跑通一个最小闭环，记录数据。`,
        ];
        const body = bodies[Math.floor(Math.random() * bodies.length)];
        return `📌 ${t}

姐妹们，最近一直在研究 ${t}，发现几个关键点：

${body}

💡 核心感悟：完成比完美重要，闭环比努力重要。

你们做 ${t} 时遇到过什么坑？评论区一起聊聊～

#${t} #AI工具 #效率 #个人成长`;
      },
    };

    const delay = 1000 + Math.random() * 800; // 1-1.8s
    setTimeout(() => {
      setDraft((generators[platform] || generators['公众号'])());
      setIsGenerating(false);
    }, delay);
  };

  const handleSave = () => {
    if (!draft.trim()) {
      alert('请先生成或编辑内容');
      return;
    }
    addContent({
      title: topic || '未命名',
      content: draft,
      platform: platform,
    });
    alert('已保存到历史记录');
    setTopic('');
    setDraft('');
  };

  // 排版预览：根据平台做段落化、视觉化重排
  const handleFormatPreview = () => {
    if (!rawText.trim()) {
      alert('请粘贴原始文本');
      return;
    }
    setFormattedText(formatContent(rawText, formatPlatform));
  };

  const formatContent = (text, platform) => {
    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (platform === '小红书') {
      // 小红书：短段落、加 emoji、空行更大
      return paragraphs
        .map((p) => {
          const emojis = ['✅', '💡', '📌', '👉', '🔥', '❗️'];
          const prefix = p.length < 20 ? `${emojis[Math.floor(Math.random() * emojis.length)]} ` : '';
          return prefix + p;
        })
        .join('\n\n');
    }

    // 公众号：标题化、段落清晰
    if (paragraphs.length > 1) {
      const title = paragraphs[0];
      const body = paragraphs.slice(1);
      return `\n${title}\n\n${body.join('\n\n')}\n`;
    }
    return text;
  };

  const formatStyle = {
    '公众号': { fontSize: '16px', lineHeight: '1.8' },
    '小红书': { fontSize: '14px', lineHeight: '2.0' },
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageTitle pageKey="content" subtitle="AI 辅助内容生产 · 产品原型" />

      {/* 模块一：IP文章撰写 */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="font-medium text-sm mb-4">IP文章撰写</div>
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="输入文章主题或灵感..."
              className="flex-1 min-w-[200px] px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <select
              className="px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option>公众号</option>
              <option>抖音口播</option>
              <option>小红书笔记</option>
            </select>
            <Button onClick={generateDraft} disabled={isGenerating}>
              {isGenerating ? '生成中...' : '生成草稿'}
            </Button>
          </div>

          {draft && (
            <div className="border border-border rounded-sm p-3 bg-[var(--surface-2)]">
              <div
                className="text-sm whitespace-pre-wrap outline-none focus:ring-1 focus:ring-black rounded px-1 min-h-[100px]"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setDraft(e.target.innerText)}
              >
                {draft}
              </div>
              <div className="flex gap-2 mt-3">
                <Button onClick={handleSave}>保存到历史</Button>
                <button
                  className="px-3 py-1 border border-border text-xs rounded-sm hover:bg-[var(--surface-2)]"
                  onClick={() => navigator.clipboard.writeText(draft).then(() => alert('已复制'))}
                >
                  复制
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 模块二：自动化排版 */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="font-medium text-sm mb-4">自动化排版</div>
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            {['公众号', '小红书'].map((p) => (
              <Tag
                key={p}
                onClick={() => setFormatPlatform(p)}
                className={formatPlatform === p ? 'opacity-100' : 'opacity-50 hover:opacity-80'}
              >
                {p}
              </Tag>
            ))}
          </div>
          <textarea
            placeholder="粘贴原始文本..."
            className="w-full px-3 py-1.5 border border-border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black min-h-[80px]"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button onClick={handleFormatPreview}>预览排版</Button>
          {formattedText && (
            <div
              className="border border-border rounded-sm p-3 bg-[var(--surface-2)] whitespace-pre-wrap"
              style={formatStyle[formatPlatform] || formatStyle['公众号']}
            >
              {formattedText}
            </div>
          )}
        </div>
      </div>

      {/* 模块三：自动化剪辑（占位） */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="font-medium text-sm mb-4">自动化剪辑</div>
          <div className="flex flex-wrap gap-2 mb-3">
          {['video-use', 'caption-clip', 'talking-head-editor', 'product-launch-video', 'claude-code-video-toolkit'].map(
            (tool) => (
              <Tag
                key={tool}
                className={['video-use', 'caption-clip'].includes(tool) ? '' : 'opacity-50'}
              >
                {tool} {['video-use', 'caption-clip'].includes(tool) ? '✅' : '⏳'}
              </Tag>
            )
          )}
        </div>
        <Button onClick={() => alert('口播文案示例：\n\n大家好，今天我们来聊聊出海营销的三个底层逻辑...')}>生成口播脚本（模拟）</Button>
      </div>

      {/* 模块四：历史记录 */}
      <div className="bg-surface border border-border rounded-md p-5">
        <div className="font-medium text-sm mb-4">历史记录</div>
        {contents.length === 0 ? (
          <div className="text-text-light text-sm">暂无内容</div>
        ) : (
          <div className="space-y-2">
            {contents.map((c) => (
              <div key={c.id} className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{c.title}</div>
                  <div className="text-xs text-text-light font-mono">
                    {c.date} · {c.platform}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    className="text-xs text-text-secondary hover:text-[var(--accent)]"
                    onClick={() => navigator.clipboard.writeText(c.content).then(() => alert('已复制'))}
                  >
                    复制
                  </button>
                  <button
                    className="text-xs text-text-secondary hover:text-red-500"
                    onClick={() => deleteContent(c.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
