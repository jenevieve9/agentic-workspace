// src/components/Editable.jsx
// 点击即改、失焦自动提交的可编辑文本组件（受控但不回写光标，避免跳动）
import { useRef, useEffect } from 'react';

export default function Editable({ value, onCommit, as = 'span', className = '', placeholder = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value ?? '')) {
      ref.current.innerText = value ?? '';
    }
  }, [value]);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      onBlur={(e) => onCommit(e.currentTarget.innerText)}
      style={!value ? { color: '#a8a8a8' } : undefined}
    />
  );
}
