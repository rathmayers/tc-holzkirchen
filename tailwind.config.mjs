/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // TC Holzkirchen Brandfarben
        clay:    { DEFAULT: '#C45C2A', light: '#D97848', dark: '#9E3F18' },
        court:   { DEFAULT: '#1A3A2A', light: '#2A5A3E', dark: '#0F2218' },
        sand:    { DEFAULT: '#F5ECD8', light: '#FAF5EC', dark: '#E8D9BC' },
        chalk:   { DEFAULT: '#FAFAF8' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '1' }],
        '9xl':  ['8rem',  { lineHeight: '1' }],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.5s ease forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
