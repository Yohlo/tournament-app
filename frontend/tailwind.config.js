module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html', 'decs.d.ts'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'blue': '#3b5a6e',
        'blueer': '#2f4858',
        'yellow': '#FFD500',
        'yellower': '#ECC500',
        'green': '#2E8B57',
        'greener': '#007F5C',
        'red': '#a30000',
        'reder': '#820000',
      },
      fontFamily: {
        'sans': ['Open Sans'],
        'pop': ['Poppins'],
        'supreme': ['Helvetica', 'Arial', 'sans-serif'],
        'pd': ['Pricedown'],
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
  safelist: [{
    pattern: /(bg|text|border)-(red|reder|blue|blueer|yellow|yellower|green|greener)/,
    variants: ['hover', 'disabled']
  }]
}
