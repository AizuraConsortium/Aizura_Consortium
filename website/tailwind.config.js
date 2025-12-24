import sharedPreset from '../shared/styles/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedPreset],
  content: [
    '/tmp/cc-agent/61496421/project/website/index.html',
    '/tmp/cc-agent/61496421/project/website/**/*.{js,ts,jsx,tsx}',
    '/tmp/cc-agent/61496421/project/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
