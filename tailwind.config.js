/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        void: '#030712',
        abyss: '#0a0f1e',
        surface: '#111827',
        glass: 'rgba(17, 24, 39, 0.7)',
        neon: {
          purple: '#A855F7',
          blue: '#3B82F6',
          cyan: '#00F0FF',
          magenta: '#EC4899',
          green: '#10B981',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(168, 85, 247, 0.35)',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(168, 85, 247, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
