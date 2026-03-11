/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050816',
          secondary: '#070B19',
          panel: 'rgba(12, 16, 34, 0.72)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.10)',
        },
        category: {
          politician: '#8EC5FF',
          journalist: '#D9B7FF',
          podcast: '#F5D08A',
          media: '#FFB7D8',
          commentator: '#A7F2B2',
          strategist: '#F7A5A5',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
