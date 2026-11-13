/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./context/**/*.{js,ts,jsx,tsx,mdx}",
      "./lib/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  },
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#EFF7EB",
          100: "#DFEFDA",
          200: "#C4DFBB",
          300: "#A4CB94",
          400: "#7EB268",
          500: "#51945A",
          600: "#3E7948",
          700: "#2D5F39",
          800: "#1D472A",
          900: "#102F1B",
          950: "#071B0E",
        },
        violet: {
          50: "#F1F6ED",
          100: "#E2ECD8",
          200: "#C9DDB8",
          300: "#ADCE96",
          400: "#86B66E",
          500: "#62995B",
          600: "#4A7E4C",
          700: "#35633A",
          800: "#234B2D",
          900: "#15341F",
          950: "#091E11",
        },
        cyber: {
          deep: "#030705",
          navy: "#08130B",
          card: "#07110A",
          elevated: "#0C1A10",
          gold: "#51945A",
          goldLight: "#A4CB94",
          goldDark: "#245A34",
          goldGlow: "#3E7948",
          amber: "#62995B",
          amberWarm: "#4A7E4C",
          cyan: "#51945A",
          turquoise: "#62995B",
          purple: "#51945A",
          violet: "#62995B",
          purpleLight: "#A4CB94",
          purpleDark: "#245A34",
          purpleGlow: "#3E7948",
          goldWarm: "#3E7948",
          white: "#FFFFFF",       // Crisp white primary text
          muted: "#AAB8A7",
          critical: "#F43F5E",    // Rose coral for critical alerts
          warning: "#F59E0B",     // Amber warning
          success: "#10B981",     // Emerald green
        }
      },
      fontFamily: {
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'cyber-cyan': '0 0 25px -3px rgba(104, 166, 109, 0.35)',
        'cyber-gold': '0 0 25px -3px rgba(98, 153, 91, 0.35)',
        'cyber-purple': '0 0 25px -3px rgba(104, 166, 109, 0.40)',
        'cyber-violet': '0 0 25px -3px rgba(98, 153, 91, 0.40)',
        'shield-glow': '0 0 50px 10px rgba(104, 166, 109, 0.25)',
        'cyber-card': '0 12px 36px -4px rgba(3, 7, 5, 0.95)',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(104, 166, 109, 0.25)' },
          '50%': { boxShadow: '0 0 35px rgba(104, 166, 109, 0.45)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
