/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        background: '#030712',
        foreground: '#f8fafc',
        atmosBg: '#030712',
        atmosBgAlt: '#0f172a',
        atmosAccent: '#3b82f6',
        atmosAccentSoft: '#60a5fa',
        atmosSuccess: '#22c55e',
        atmosWarning: '#f59e0b',
        atmosError: '#ef4444',
        atmosText: '#f8fafc',
        atmosTextMuted: '#94a3b8',
        atmosTextSubtle: '#64748b',
        atmosViolet: '#8b5cf6',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
