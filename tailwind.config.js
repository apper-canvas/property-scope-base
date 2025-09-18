/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f2',
          100: '#dceee2',
          500: '#2C5F3A',
          600: '#1f4a2b',
          700: '#1a3e24',
        },
        secondary: {
          50: '#faf9f7',
          100: '#f0ede8',
          500: '#8B7355',
          600: '#7a6449',
          700: '#6b563e',
        },
        accent: {
          50: '#fdf8f2',
          100: '#f8eed8',
          500: '#D4A574',
          600: '#c5935a',
          700: '#b8824a',
},
        surface: '#FFFFFF',
        background: '#3B82F6',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}