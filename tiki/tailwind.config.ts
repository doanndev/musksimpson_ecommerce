import { nextui } from '@nextui-org/react';
import svgToTinyDataUri from 'mini-svg-data-uri';
import { withTV } from 'tailwind-variants/transformer';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        // sm: '600px',
        // md: '728px',
        // lg: 'px',
        xl: '1240px',
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.serif],
        serif: ['var(--font-serif)', ...fontFamily.serif],
      },
      colors: {
        neutral: {
          0: '#ffffff',
          300: '#D2D5E2',
          400: '#B6BCCD',
          600: '#79829F',
          700: '#626981',
          800: '#4B5162',
          900: '#343844',
          1000: '#1C1F25',
        },
        background: {
          DEFAULT: '#f5f5fa',
        },
      },
      height: {
        header: '100px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      addCommonColors: false,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      layout: {},
      themes: {
        light: {
          layout: {},
          colors: {
            background: {
              DEFAULT: '#FFFFFF',
            },
            foreground: {
              DEFAULT: '#4B5162',
            },
            primary: {
              '50': '#eff6ff',
              '100': '#eff5ff',
              '200': '#dce8fd',
              '300': '#B6D1FB',
              '400': '#95befb',
              '500': '#6099f7',
              '600': '#387FF5',
              '700': '#2957e7',
              '800': '#2043d5',
              '900': '#2137ac',
              DEFAULT: '#387FF5',
            },
          },
        },
      },
    }),
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'bg-dot-thick': (value: any) => ({
            backgroundImage: `url("${svgToTinyDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="5"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    },
    plugin(({ addUtilities }) => {
      addUtilities({
        '.inset-center': {
          top: '50%',
          left: '50%',
          '@apply absolute -translate-x-1/2 -translate-y-1/2': {},
        },
        '.inset-y-center': {
          top: '50%',
          '@apply absolute -translate-y-1/2': {},
        },
        '.inset-x-center': {
          left: '50%',
          '@apply absolute -translate-x-1/2': {},
        },
        '.text-stroke-5': {
          background: 'linear-gradient(180deg, #0132E1 10.14%, #D81220 58%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-stroke': '5px transparent',
          color: '#fff',
        },
        '.app-container': {
          '@apply w-full max-w-[1328px] mx-auto px-4 lg:px-6': {},
        },
      });

      require('tailwindcss-animate');
      require('tailwind-scrollbar');
      require('@tailwindcss/typography');
    }),
  ],
};
export default withTV(config);
