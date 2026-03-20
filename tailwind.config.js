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
        // ─── TRUE BLACK PALETTE (inspired by reference design) ───────────────
        // Replacing dead navy-blues with pure blacks and sharp dark tones
        gray: {
          50:  '#f9fafb',   // Light mode page bg
          100: '#f3f4f6',   // Light mode section bg
          200: '#e5e7eb',   // Light mode borders
          300: '#d1d5db',   // Light mode muted text
          400: '#6b7280',   // Muted icons / placeholders
          500: '#4b5563',   // Secondary text (dark mode)
          600: '#374151',   // Strong muted text
          700: '#1f2937',   // Dark mode card borders → nearly invisible edge
          750: '#161616',   // (custom) Dark mode inner panels
          800: '#111111',   // Dark mode card backgrounds → near black
          900: '#0a0a0a',   // Dark mode page background → true black
          950: '#050505',   // Deepest blacks
        },

        // ─── BRAND ACCENT – Electric Blue-to-Violet (vivid, never muted) ────
        // Primary CTA gradient defined in CSS via .gradient-bg
        // These tokens give components direct access to brand colors
        brand: {
          DEFAULT: '#0066FF',    // Electric Blue — primary actions
          light:   '#3D8AFF',    // Hover / lighter tint
          dark:    '#0044CC',    // Pressed / darker
          alt:     '#7000FF',    // Vivid electric violet (accent, NOT muted purple)
        },

        // ─── SEMANTIC VIVID ACCENTS (per-feature colors like reference image) ─
        neon: {
          blue:   '#00AAFF',   // Info, AI features
          green:  '#00E676',   // Success, connected states
          amber:  '#FFB300',   // Warning, pending, caution
          red:    '#FF3D3D',   // Error, danger, recording
          violet: '#AA00FF',   // Premium / Pro features
          cyan:   '#00E5FF',   // Analytics, data highlights
        },

        // ─── LEGACY ALIASES (keep so old component classes don't break) ───────
        'cf-dark-bg':  '#0a0a0a',
        'cf-panel-bg': '#111111',
        'cf-purple':   '#AA00FF',   // now vivid violet, not muted purple
        'cf-green':    '#00E676',
        'cf-orange':   '#FFB300',
        'cf-red':      '#FF3D3D',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Reusable gradient shortcuts
        'brand-gradient':   'linear-gradient(135deg, #0066FF 0%, #7000FF 100%)',
        'brand-gradient-h': 'linear-gradient(90deg, #0066FF 0%, #00E5FF 100%)',
        'dark-surface':     'linear-gradient(145deg, #111111 0%, #0d0d0d 100%)',
      },
      boxShadow: {
        'brand-sm':  '0 0 16px rgba(0, 102, 255, 0.25)',
        'brand-lg':  '0 0 40px rgba(0, 102, 255, 0.35)',
        'neon-green':'0 0 16px rgba(0, 230, 118, 0.30)',
        'neon-red':  '0 0 16px rgba(255, 61, 61, 0.35)',
        'card':      '0 1px 3px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
