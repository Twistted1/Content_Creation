/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'cf-dark-bg': '#1a1a2e',
        'cf-panel-bg': '#2b2b3a',
        'cf-purple': '#9c27b0',
        'cf-green': '#00ff88',
        'cf-orange': '#ff9800',
        'cf-red': '#ff4444',
      },},
  },
  plugins: [],
};

