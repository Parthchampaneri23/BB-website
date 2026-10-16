/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bb: {
          blue: '#0069f7',
          blueHover: '#0053c7',
          navy: '#01142e',
          navyLight: '#07244d',
          ice: '#eaf2ff',
          border: '#dbe7f5',
          bg: '#f5f8fc',
        },
        // Maintain alias for any legacy classes
        bs: {
          red: '#0069f7',
          redDark: '#01142e',
          peach: '#eaf2ff',
          dark: '#01142e',
          border: '#dbe7f5',
          bg: '#f5f8fc',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
