module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', 'decs.d.ts'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans'],
        'pop': ['Poppins'],
        'supreme': ['Helvetica', 'Arial', 'sans-serif'],
      },
      outline: {
        solid: '2px solid black'
      }
    },
    boxShadow: {
      inner: 'inset -1px 0 3px -1px rgba(0, 0, 0, 0.06)',
      outer: '1px 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
