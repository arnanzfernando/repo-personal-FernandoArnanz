/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", 
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D4ED8',  
          600: '#1D4ED8',
          700: '#1E40AF'      
        },
        secondary: {
          DEFAULT: '#10B981', 
          600: '#10B981',
          700: '#059669'      
        },
        accent: {
          DEFAULT: '#F59E0B', 
          600: '#F59E0B',
          700: '#D97706'      
        },
        background: {
          light: '#F9FAFB',   // para modo claro
          dark: '#1F2937',    // para modo oscuro
        },
        text: {
          light: '#111827',   // texto claro
          dark: '#E5E7EB',    // texto oscuro
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}