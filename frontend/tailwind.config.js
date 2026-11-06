/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        rome: {
          dark: "#08090D",
          card: "#11141B",
          border: "#1E2433",
          primary: "#3B82F6",
          accent: "#8B5CF6",
          solana: "#14F195",
          solanaPurple: "#9945FF",
          gold: "#F59E0B",
          surface: "#161B26",
          textDim: "#94A3B8"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        solanaGlow: '0 0 25px -5px rgba(20, 241, 149, 0.3)',
      }
    },
  },
  plugins: [],
}
