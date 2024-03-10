/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/*.html'],
  theme: {
    fontFamily: {
      'sans': 'Open Sans, ui-sans-serif, system-ui',
    },
    container: {
      // you can configure the container to be centered
      center: true,

      // or have default horizontal padding
      padding: '1rem',

      // default breakpoints but with 40px removed
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1120px',
        '2xl': '1120px',
      },
    },
    extend: {
      colors: {
        'green': '#69af4b',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

