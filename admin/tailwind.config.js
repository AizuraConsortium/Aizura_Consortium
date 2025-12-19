import sharedPreset from '../shared/styles/tailwind.preset.js';

export default {
  presets: [sharedPreset],
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
