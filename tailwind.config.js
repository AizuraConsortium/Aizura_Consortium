// tailwind.config.js
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './index.html',
    './admin/**/*.{js,ts,jsx,tsx,html,css,cjs,tsx}',
    './website/**/*.{js,ts,jsx,tsx,html,css,cjs,tsx}',
    './client/**/*.{js,ts,jsx,tsx,html,css,cjs,tsx}',
    './shared/**/*.{js,ts,jsx,tsx,html,css,cjs,tsx}',
    '!./node_modules/**/*',
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'hover:bg-primary/90',
    'focus:ring-primary',
    'disabled:bg-primary/15',
    'disabled:text-gray-900',
    'disabled:border',
    'disabled:border-primary/40',
    'bg-primary/10',
    'bg-accent',
    'text-accent',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5A333',
        secondary: '#E6F1FC',
        accent: '#FF8C42',
        'gray-100': '#F9F9F9',
        border: '#E0E0E0',
        text: {
          DEFAULT: '#333333',
          subtle: '#666666',
        },
        dark: '#101522',
        'dark-card': '#181F2A',
        'dark-border': '#232c3c',
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text.DEFAULT'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.accent'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}

export default config
