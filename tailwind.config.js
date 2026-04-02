/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffffff',
        foreground: '#1e293b',
        primary: {
          DEFAULT: '#4a0e96',
          foreground: '#ffffff',
        },
        purple: {
          100: '#f4f0fa',
          500: '#4a0e96',
          600: '#4c00a4',
          700: '#3c0080',
          800: '#2d0a59',
          900: '#1a0b2e',
        },
        status: {
          critical: '#ef4444',
          criticalBg: '#fef2f2',
          high: '#f97316',
          highBg: '#fff7ed',
          medium: '#eab308',
          mediumBg: '#fefce8',
          success: '#22c55e',
          successBg: '#f0fdf4',
          info: '#3b82f6',
          infoBg: '#eff6ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
