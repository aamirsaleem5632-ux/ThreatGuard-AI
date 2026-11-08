/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          deep: "#07111F",      // Main application background
          navy: "#0B1726",      // Sidebar and navigation
          card: "#101F30",      // Dashboard cards
          elevated: "#17283A",  // Panels, dropdowns, and modals
          cyan: "#24D6E8",      // Interactive highlights & active states
          turquoise: "#21C7B7", // AI & monitoring telemetry indicators
          gold: "#D9AE58",      // Premium accents & verified statuses
          white: "#F5F7FA",     // Primary text
          muted: "#91A0B2",     // Secondary text
          critical: "#F05252",  // Critical security findings & P1 alerts
          warning: "#E8A84A",   // Medium / High warnings
          success: "#34B883",   // Verified success / hardened posture
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyber-cyan': '0 0 15px -3px rgba(36, 214, 232, 0.3)',
        'cyber-gold': '0 0 15px -3px rgba(217, 174, 88, 0.3)',
        'cyber-red': '0 0 15px -3px rgba(240, 82, 82, 0.4)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
