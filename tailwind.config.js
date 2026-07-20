/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 全部映射为 CSS 变量，由 data-theme 切换
        bg: 'var(--bg-solid)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'text-main': 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-light': 'var(--text-light)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
}
