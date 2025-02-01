import { resolve } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 8px 32px rgba(0,0,0,0.12)',
      },
      colors: {
        selected: '#3366FF',
        resolve: '#41AF45',
        light: {
          'bg': '#F1F1F1',
          'card': '#F9F9F9',
          'input': '#F4F4F4',
          'placeholder': '#0D0D0D',
          'titlebar': '#F9F9F9',
        },
        dark: {
          'bg': '#212121',
          'card': '#171717',
          'input': '#2F2F2F',
          'placeholder': '#ECECEC',
          'titlebar': '#171717',
        }
      },
      fontFamily: {
        chalkboard: ['"Chalkboard SE"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
}