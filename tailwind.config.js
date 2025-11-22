/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{html,js}',
    './src/components/**/*.{html,js}',
    './*.php',
    './components/*.php',
    './template-parts/**/*.php'
  ],
  corePlugins: {
    container: false // Tailwindのcontainerクラスを無効化
  },
  theme: {
    extend: {},
    spacing: {
      1: '0.4rem',
      2: '0.8rem',
      3: '1.2rem',
      4: '1.6rem',
      5: '2rem',
      6: '2.4rem',
      7: '2.8rem',
      8: '3.2rem',
      9: '3.6rem',
      10: '4rem',
      11: '4.4rem',
      12: '4.8rem',
      13: '5.2rem',
      14: '5.6rem',
      15: '6rem',
      16: '6.4rem',
      20: '8rem',
      23: '9.2rem',
      24: '9.6rem',
      25: '10rem',
      32: '12rem',
      40: '16rem',
      48: '19.2rem',
      56: '22.4rem',
      64: '25.6rem'
    },
    fontSize: {
      xs: '1.2rem',
      sm: '1.4rem',
      base: '1.6rem',
      lg: '1.8rem',
      xl: '2rem'
    }
  },
  plugins: []
};
