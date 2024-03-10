const options = require("./config"); //options from config.js

const allPlugins = {
  typography: require("@tailwindcss/typography"),
  forms: require("@tailwindcss/forms"),
  containerQueries: require("@tailwindcss/container-queries"),
};

const plugins = Object.keys(allPlugins)
  .filter((k) => options.plugins[k])
  .map((k) => {
    if (k in options.plugins && options.plugins[k]) {
      return allPlugins[k];
    }
  });

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,php}"],
  darkMode: "class",
  purge: {
    safelist: [
      'text-2xl',
      'text-3xl',
      'text-4xl',
      'text-5xl',
      'text-6xl'
    ],
  },
  experimental: {
    optimizeUniversalDefaults: true
  },
  theme: {
    fontFamily: {
      'sans': 'Open Sans, ui-sans-serif, system-ui',
    },
    fontSize: {
      xxs: '11px',
      xs: '13px',
      sm: '14px',
      base: '15px',
      "md": '18px',
      "lg": "20px",
      "xl": '22px',
      "2xl": "24px",
      "3xl": "36px",
      "4xl": "42px",
    },
     borderRadius: {
      'none': '0',
      'sm': '3px',
      DEFAULT: '6px',
      'lg': '6px',
      'full': '9999px',
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
        'ringColor': '#69af4b',
        'outlineColor': '#69af4b',
        'green': {
          '300' : '#8CBE60',
          DEFAULT : '#69af4b',
        },
        'gray': {
          '50' : '#EFEFE7',
          '100': '#F6F6F6',
          '150': '#EEEEEE',
          '200': '#B7B6B6',
          "300": "#D3D3D3",
          "400": "#A9A9A9",
          DEFAULT: "#A9A9A9",
          "500": "#666666",
          "600": "#1E2E36",
          "700": "#3f3f3f"
        },
        'orange': {
          '50' : '#FBFAF8', 
          '100': '#FFF7E5',
          DEFAULT: "#F1840E",
          '400': '#F1840E',
          '700': '#F15B0E',
        },
        'yellow': {
          '50' : '#F9F9F5',
          '100': '#F4F6F1',
          DEFAULT: "#FED44C",
          '400': '#FED44C'
        },
        'blue': {
          DEFAULT: "#008DEB",
          '500': "#008DEB",
        },
        "slate": {
          // "dark": "#0b3a42",
          // "50": "#ebf5f2",
          // "100": "#d9e4e3",
          // "200": "#b8d0d1",
          "300": "#D3D3D3",
          "400": "#444F54",
          // DEFAULT: "#0f6973",
          // "600": "#0f555f",
          // "700": "#0a414b",
          // "800": "#05373c"
        },
      },
      spacing: {
        '0.2': '2px',
        '0.5': '3px',
        '1': '5px',
        '2': '8.5px',
        '3': '10px',
        '4': '15px',
        '5': '20px',
        '6': '24px',
        '8': '30px',
        '9': '40px',
        '10': '50px',
        '10.5': '60px',
        '11': '70px',
        '12': '90px'
      }
    },
  },
  plugins: plugins,
};
