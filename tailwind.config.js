/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'false',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas-neue': ['Bebas Neue', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'graystroke':['GRAYSTROKE', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      }, 
      fontSize: {
        xs: '0.55rem',
        sm:	'0.875rem', /* 14px */
        base:	'1rem', /* 16px */
        lg: '1.125rem', /* 18px */
        xl:'1.25rem',/* 20px */
        '2xl':'1.5rem', /* 24px */
        '3xl':'1.875rem',/* 30px */
        '4xl': '2.25rem', /* 36px */
        '5xl':'3rem', /* 48px */
        '6xl':'3.75rem', /* 60px */
        '7xl':'4.5rem', /* 72px */
        '8xl':'6rem', /* 96px */
        '9xl':'8rem' /* 128px */
      },
      boxShadow: {
        'card': '0 0 10px 3px rgba(255, 255, 255, 0.5)',
        'input': '0 0 10px 3px rgba(227, 18, 140, 0.5)',
        'focus': 'inset 0 0 3px 3px rgba(227, 18, 140, 0.5)',

      },
      colors: {
        'elite-blue': '#0a1366', // rgb(10,19,102)
        'light-purple': '#f505f5', // rgb(245,5,245)
        'pink-buster': '#E3128C', // rgb(227,18,140)
        'purple': '#800080' // rgb(128,0,128)
      },
    },
    plugins: [
      require('flowbite/plugin'),
    ],
  }
};