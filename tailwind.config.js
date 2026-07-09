/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        devibe: {
          bg: "#0A0A0F",
          surface: "#12121A",
          card: "#1A1A28",
          border: "rgba(255,255,255,0.08)",
          purple: "#A855F7",
          "purple-dark": "#7C3AED",
          blue: "#3B82F6",
          "blue-neon": "#60A5FA",
          green: "#22C55E",
          orange: "#F97316",
          muted: "#6B7280",
          text: "#F9FAFB",
          "text-secondary": "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(168, 85, 247, 0.4)",
        "neon-blue": "0 0 20px rgba(59, 130, 246, 0.4)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
