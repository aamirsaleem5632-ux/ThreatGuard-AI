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
        cyber: {
          deep: "#030305",        // Obsidian Slate primary canvas
          navy: "#080714",        // Structural obsidian panels
          card: "#0B0A10",        // Dark slate tinted card surfaces
          elevated: "#0F0E18",    // Modals, dropdowns, elevated surfaces
          gold: "#A855F7",        // Primary purple accent (was gold)
          goldLight: "#C084FC",   // Light purple highlight
          goldDark: "#6D28D9",    // Deep violet shadow
          goldGlow: "#7C3AED",    // Ambient purple glow
          amber: "#8B5CF6",       // Violet accent (was amber)
          amberWarm: "#7C3AED",   // Deep violet warm
          cyan: "#A855F7",        // Alias: purple
          turquoise: "#8B5CF6",   // Alias: violet
          purple: "#A855F7",      // Purple-500
          violet: "#8B5CF6",      // Violet-500
          purpleLight: "#C084FC", // Purple-400
          purpleDark: "#6D28D9",  // Violet-700
          purpleGlow: "#7C3AED",  // Violet-600
          goldWarm: "#7C3AED",    // Alias: violet-600
          white: "#FFFFFF",       // Crisp white primary text
          muted: "#A1A1AA",       // Muted lavender silver secondary text
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
        'cyber-cyan': '0 0 25px -3px rgba(147, 51, 234, 0.35)',
        'cyber-gold': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'cyber-purple': '0 0 25px -3px rgba(147, 51, 234, 0.40)',
        'cyber-violet': '0 0 25px -3px rgba(139, 92, 246, 0.40)',
        'shield-glow': '0 0 50px 10px rgba(147, 51, 234, 0.25)',
        'cyber-card': '0 12px 36px -4px rgba(3, 3, 5, 0.95)',
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
          '0%, 100%': { boxShadow: '0 0 15px rgba(147, 51, 234, 0.25)' },
          '50%': { boxShadow: '0 0 35px rgba(147, 51, 234, 0.45)' },
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
