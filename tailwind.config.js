/** @type {import('tailwindcss').Config} */
// Tema HITSTOP: nama token lama (gold/obsidian/ivory) dipertahankan agar kelas di seluruh halaman tetap bekerja,
// tetapi nilainya kini merah arcade / ink / paper.
export default {
  content: ['./components/**/*.{js,vue,ts}','./layouts/**/*.vue','./pages/**/*.vue','./plugins/**/*.{js,ts}','./app.vue'],
  theme: { extend: {
    colors: {
      gold: { 300:'#FFE27A', 400:'#F5C518', 500:'#FF3B3B', 600:'#D9141B', 700:'#9C0B11', 800:'#6E080C' },
      obsidian: { 900:'#1D1F27', 950:'#14151A' },
      ivory: '#F4F7F9',
    },
    fontFamily: {
      display: ['"Big Shoulders Display"','Impact','"Arial Narrow"','sans-serif'],
      serif: ['Barlow','"Helvetica Neue"','Arial','sans-serif'],
      body: ['Barlow','"Helvetica Neue"','Arial','sans-serif'],
      mono: ['"Share Tech Mono"','ui-monospace','Menlo','monospace'],
    },
  } },
  plugins: [],
}
