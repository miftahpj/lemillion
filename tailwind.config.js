/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F0D98A',
          400: '#E8C96A',
          500: '#C9963A',
          600: '#A87B2C',
          700: '#8A6020',
          800: '#6B4918',
        },
        obsidian: {
          900: '#1a1208',
          950: '#0C0A07',
        },
        ivory: '#F5F0E8',
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        // System serif stack — tampil italic sama elegannya tanpa perlu
        // download font tambahan (poin penting untuk web yang ringan).
        serif:   ['Georgia', '"Times New Roman"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
