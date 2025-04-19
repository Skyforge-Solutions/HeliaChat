/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6366f1', // Indigo for light mode
          dark: '#818cf8', // Lighter indigo for dark mode
        },
        secondary: {
          light: '#f3f4f6', // Light gray for light mode
          dark: '#1f2937', // Dark gray for dark mode
        },
        background: {
          light: '#ffffff',
          dark: '#111827',
        },
        text: {
          light: '#1f2937',
          dark: '#f9fafb',
        },
      },
    },
  },
  plugins: [
    typography
  ],
}