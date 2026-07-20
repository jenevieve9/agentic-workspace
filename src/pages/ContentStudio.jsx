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

  // 模拟AI生成
  const generateDraft = () => {
    if (!topic.trim()) {
      alert('请输入主题或灵感');
      return;
    }
    setIsGenerating(true);
    setDraft('');

    setTimeout(() => {
      const templates = {
        '公众号': `【${topic}】\n\n在出海营销的实践中，品牌需要更本地化的内容策略。结合AI工具，快速生成多语言素材，通过数据分析优化转化路径。\n\n下一步：1. 建立内容矩阵 2. 测试反馈 3. 迭代优化。\n\n#出海营销 #AI工具 #内容策略`,
        '抖音口播': `大家好，今天我们来聊聊 ${topic}。\n\n很多人在做这件事的时候都会犯一个错误，就是忽略了底层逻辑。\n\n其实核心就三点：第一，明确目标；第二，选对工具；第三，持续迭代。\n\n关注我，带你了解更多干货。`,
        '小红书笔记': `📌 ${topic}\n\n最近在研究这个话题，发现几个值得分享的点：\n\n✅ 第一个关键认知\n✅ 第二个实操方法\n✅ 第三个避坑指南\n\n你们有没有遇到过类似的问题？评论区聊聊～`,
      };
      const result = templates[platform] || templates['公众号'];
      setDraft(result);
      setIsGenerating(false);
    }, 1200);
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

  // 排版预览
  const handleFormatPreview = () => {
    if (!rawText.trim()) {
      alert('请粘贴原始文本');
      return;
    }
    setFormattedText(rawText);
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
              className="border border-border rounded-sm p-3 bg-[var(--surface-2)]"
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
