const { scrollbarGutter, scrollbarWidth, scrollbarColor } = require('tailwind-scrollbar-utilities');
/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        dynamic: "var(--color)"
      },
      fontFamily: {
        circular: ['Circular']
      }

    },
  },
  plugins: [
    require("tailwindcss-animate"),
    scrollbarGutter(), // no options to configure
    scrollbarWidth(), // no options to configure
    scrollbarColor(), // no options to configure

  ],
}

