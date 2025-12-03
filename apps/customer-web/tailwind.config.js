/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#3D5AFE',
          dark: '#2C04FE',
        },
        accent: {
          main: '#F7A600',
        },
        success: {
          main: '#00AC47',
        },
        danger: {
          main: '#FF4D4F',
        },
        background: {
          primary: '#13111A',
          secondary: '#121212',
          tertiary: '#26242C',
        },
      },
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
